
import React from 'react';
import WelcomeBase from './WelcomeBase';
import QuizoraVisitorGuide from '@/Components/QuizoraVisitorGuide';

export default function Welcome(props) {
    return (
        <>
            <WelcomeBase {...props} />
            <QuizoraVisitorGuide />
        </>
    );
}
