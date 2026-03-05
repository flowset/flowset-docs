(function () {
    const imageSelectors = [
        '.doc .imageblock img',
        '.doc span.image img',
    ].join(', ');

    const lightbox = createLightbox();
    let restoreFocusElement = null;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        const docImages = document.querySelectorAll(imageSelectors);
        docImages.forEach(function (image) {
            if (!isLightboxEnabled(image)) return;
            image.classList.add('img-preview__target');
            image.addEventListener('click', function (event) {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                event.preventDefault();
                openLightbox(image);
            });
        });
    }

    function isLightboxEnabled(image) {
        return !image.classList.contains('no-lightbox') &&
            !image.closest('.no-lightbox');
    }

    function openLightbox(image) {
        const link = image.closest('a[href]');
        const source = link ? link.getAttribute('href') : image.getAttribute('src');
        if (!source) return;

        const alt = image.getAttribute('alt') || '';
        lightbox.image.setAttribute('src', source);
        lightbox.image.setAttribute('alt', alt);
        restoreFocusElement = document.activeElement;
        document.body.classList.add('img-preview-open');
        lightbox.dialog.setAttribute('aria-hidden', 'false');
        if (typeof lightbox.dialog.showModal === 'function') {
            lightbox.dialog.showModal();
        } else {
            lightbox.dialog.setAttribute('open', 'open');
        }
        if (typeof lightbox.dialog.focus === 'function') {
            lightbox.dialog.focus({ preventScroll: true });
        }
    }

    function closeLightbox() {
        if (!lightbox.dialog.open) return;
        if (typeof lightbox.dialog.close === 'function') {
            lightbox.dialog.close();
        } else {
            lightbox.dialog.removeAttribute('open');
        }
        lightbox.image.removeAttribute('src');
        lightbox.image.removeAttribute('alt');
        lightbox.dialog.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('img-preview-open');
        if (restoreFocusElement && typeof restoreFocusElement.focus === 'function') {
            restoreFocusElement.focus();
        }
        restoreFocusElement = null;
    }

    function createLightbox() {
        const dialog = document.createElement('dialog');
        dialog.className = 'img-preview__dialog';
        dialog.setAttribute('aria-hidden', 'true');
        dialog.setAttribute('tabindex', '-1');

        const content = document.createElement('div');
        content.className = 'img-preview__content';

        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = 'img-preview__close';
        closeButton.setAttribute('aria-label', 'Close image preview');
        closeButton.setAttribute('title', 'Close');
        closeButton.innerHTML = '&times;';

        const image = document.createElement('img');
        image.className = 'img-preview__full';

        content.appendChild(closeButton);
        content.appendChild(image);
        dialog.appendChild(content);
        document.body.appendChild(dialog);

        closeButton.addEventListener('click', closeLightbox);
        dialog.addEventListener('close', function () {
            document.body.classList.remove('img-preview-open');
            dialog.setAttribute('aria-hidden', 'true');
        });
        dialog.addEventListener('cancel', function () {
            closeLightbox();
        });
        dialog.addEventListener('click', function (event) {
            if (event.target === dialog) closeLightbox();
        });
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && dialog.open) closeLightbox();
        });

        return { dialog: dialog, closeButton: closeButton, image: image };
    }
})()
