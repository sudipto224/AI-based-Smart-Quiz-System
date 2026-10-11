<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Smalot\PdfParser\Parser;
use ZipArchive;

class MaterialTextExtractor
{
    public function extract(UploadedFile $file): string
    {
        $extension = strtolower($file->getClientOriginalExtension());

        if ($extension === 'pdf') {
            return $this->extractPdf($file);
        }

        if ($extension === 'pptx') {
            return $this->extractPptx($file);
        }

        throw new \InvalidArgumentException(
            'Only PDF and PPTX files are supported.'
        );
    }

    private function extractPdf(UploadedFile $file): string
    {
        $parser = new Parser();
        $pdf = $parser->parseFile($file->getRealPath());

        $text = $pdf->getText();
        $text = $this->cleanText($text);

        if ($text === '') {
            throw new \InvalidArgumentException(
                'The uploaded PDF contains no readable text.'
            );
        }

        return $text;
    }

    private function extractPptx(UploadedFile $file): string
    {
        if (!class_exists(ZipArchive::class)) {
            throw new \RuntimeException(
                'PHP ZipArchive extension is required to parse PPTX files.'
            );
        }

        $zip = new ZipArchive();

        if ($zip->open($file->getRealPath()) !== true) {
            throw new \InvalidArgumentException(
                'Unable to open the uploaded PPTX file.'
            );
        }

        $slideIndex = 1;
        $slideTexts = [];

        while (true) {
            $slidePath = "ppt/slides/slide{$slideIndex}.xml";

            if ($zip->locateName($slidePath) === false) {
                break;
            }

            $slideXml = $zip->getFromName($slidePath);

            if ($slideXml !== false) {
                $slideTexts[] = $this->extractTextFromSlideXml($slideXml);
            }

            $slideIndex++;
        }

        $zip->close();

        if (empty($slideTexts)) {
            throw new \InvalidArgumentException(
                'The uploaded PPTX contains no readable slides or text.'
            );
        }

        $text = implode("\n\n", array_filter($slideTexts, fn ($value) => $value !== ''));
        $text = $this->cleanText($text);

        if ($text === '') {
            throw new \InvalidArgumentException(
                'The uploaded PPTX contains no readable text.'
            );
        }

        return $text;
    }

    private function extractTextFromSlideXml(string $slideXml): string
    {
        $textFragments = [];

        libxml_use_internal_errors(true);

        $xml = new \DOMDocument();

        if (@$xml->loadXML($slideXml) === true) {
            $nodes = $xml->getElementsByTagName('t');

            foreach ($nodes as $node) {
                $content = trim($node->textContent);

                if ($content !== '') {
                    $textFragments[] = $content;
                }
            }
        }

        if (empty($textFragments)) {
            if (preg_match_all('/<a:t[^>]*>([^<]+)<\/a:t>/i', $slideXml, $matches)) {
                foreach ($matches[1] as $match) {
                    $trimmed = trim(html_entity_decode($match, ENT_QUOTES | ENT_XML1, 'UTF-8'));

                    if ($trimmed !== '') {
                        $textFragments[] = $trimmed;
                    }
                }
            }
        }

        return implode(' ', $textFragments);
    }

    private function cleanText(string $text): string
    {
        $text = str_replace(["\r\n", "\r", "\t", "\x0B", "\x0C"], ["\n", "\n", ' ', ' ', ' '], $text);
        $text = preg_replace('/[ \t]+/', ' ', $text);
        $text = preg_replace('/\n{2,}/', "\n\n", $text);
        $text = preg_replace('/ +\n/', '\n', $text);
        $text = preg_replace('/\n +/', '\n', $text);
        $text = trim($text);

        return $text;
    }
}
