
export function useScrollLock(condition) {
    $effect(() => {
        if (condition()) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
            document.body.style.paddingRight = `${scrollbarWidth}px`;
            document.body.classList.add('scroll-locked');
        } else {
            document.body.classList.remove('scroll-locked');
            document.body.style.paddingRight = '';
        }
        return () => {
            document.body.classList.remove('scroll-locked');
            document.body.style.paddingRight = '';
        };
    });
}