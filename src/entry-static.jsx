import React from 'react';
import { renderToString } from 'react-dom/server';
import Website from './Website.jsx';
import ContentPage from './pages/ContentPage.jsx';
export function renderPage(page, html) {
  return renderToString(
    page ? <ContentPage page={page} initialHtml={html} /> : <Website design="clarity" />,
  );
}
