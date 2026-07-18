function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

document.addEventListener('DOMContentLoaded', () => {
    const steps = Array.from(document.querySelectorAll('.journey-step'));
    const particle = document.querySelector('.journey-particle');
    const line = document.querySelector('.journey-line');
    if (!steps.length || !particle || !line) return;

    const duration = 5200;
    let startTime = performance.now();
    let paused = false;
    let activeStepIndex = -1;

    const getStepBounds = () => {
        return steps.map((step) => {
            const node = step.querySelector('.journey-node');
            const nodeRect = node.getBoundingClientRect();
            const particleRect = particle.getBoundingClientRect();
            const nodeCenterX = nodeRect.left + nodeRect.width / 2;
            const particleCenterX = particleRect.left + particleRect.width / 2;
            return {
                step,
                nodeCenterX,
                particleCenterX,
                overlap: Math.abs(nodeCenterX - particleCenterX) <= 24
            };
        });
    };

    const updateJourney = () => {
        const bounds = getStepBounds();
        const reachedIndex = bounds.findIndex(({ overlap }) => overlap);

        if (reachedIndex !== -1) {
            activeStepIndex = reachedIndex;
        }

        steps.forEach((step, index) => {
            step.classList.toggle('active', index <= activeStepIndex);
        });
    };

    const tick = () => {
        if (paused) return;

        const elapsed = performance.now() - startTime;
        const progress = (elapsed % duration) / duration;
        particle.style.left = `${progress * 100}%`;
        updateJourney();
        requestAnimationFrame(tick);
    };

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            paused = true;
        } else {
            paused = false;
            startTime = performance.now();
            activeStepIndex = -1;
            requestAnimationFrame(tick);
        }
    });

    window.addEventListener('resize', updateJourney);
    updateJourney();
    requestAnimationFrame(tick);
});