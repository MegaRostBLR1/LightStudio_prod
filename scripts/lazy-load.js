(() => {
    const EAGER_SELECTOR = [
        '.logo-img',
        '.hero-image-wrapper img',
        '.product-modal-image',
        '#certificateModal img'
    ].join(',');

    const prepareImage = (image) => {
        if (!(image instanceof HTMLImageElement)) {
            return;
        }

        if (image.matches(EAGER_SELECTOR)) {
            return;
        }

        if (!image.hasAttribute('loading')) {
            image.setAttribute('loading', 'lazy');
        }

        if (!image.hasAttribute('decoding')) {
            image.setAttribute('decoding', 'async');
        }
    };

    const prepareImages = (root = document) => {
        if (root instanceof HTMLImageElement) {
            prepareImage(root);
            return;
        }

        root.querySelectorAll?.('img').forEach(prepareImage);
    };

    prepareImages();

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    prepareImages(node);
                }
            });
        });
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();
