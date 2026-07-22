(function () {
    var prefersReduced =
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var term = document.querySelector('.terminal');
    if (!term || prefersReduced) return;

    var typedEls = term.querySelectorAll('.cmd__typed');
    if (typedEls.length < 2) return;

    term.classList.add('is-animated');

    function caretFor(el) {
        var next = el.nextElementSibling;
        return next && next.classList.contains('caret') ? next : null;
    }

    var whoami = { el: typedEls[0], caret: caretFor(typedEls[0]) };
    var join = { el: typedEls[1], caret: caretFor(typedEls[1]) };

    whoami.text = whoami.el.textContent;
    join.text = join.el.textContent;
    whoami.el.textContent = '';
    join.el.textContent = '';

    function sleep(ms) {
        return new Promise(function (resolve) {
            setTimeout(resolve, ms);
        });
    }

    function type(node, text, speed) {
        return new Promise(function (resolve) {
            var i = 0;
            (function tick() {
                node.textContent = text.slice(0, i);
                if (i++ < text.length) setTimeout(tick, speed);
                else resolve();
            })();
        });
    }

    function show(el) {
        if (el) el.classList.add('is-shown');
    }

    async function boot() {
        await sleep(300);

        whoami.caret && whoami.caret.classList.add('caret--on');
        await sleep(420);
        await type(whoami.el, whoami.text, 60);
        await sleep(340);
        whoami.caret && whoami.caret.classList.remove('caret--on');

        show(term.querySelector('.title'));
        await sleep(260);

        var lines = term.querySelectorAll('.taglines .reveal');
        for (var i = 0; i < lines.length; i++) {
            show(lines[i]);
            await sleep(160);
        }
        await sleep(320);

        show(join.el.closest('.cmd'));
        await sleep(220);
        join.caret && join.caret.classList.add('caret--on');
        await sleep(300);
        await type(join.el, join.text, 55);
        await sleep(240);

        var btns = term.querySelectorAll('.channels .reveal');
        for (var j = 0; j < btns.length; j++) {
            show(btns[j]);
            await sleep(90);
        }
    }

    boot();
})();

(function () {
    var prefersReduced =
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var dots = document.querySelectorAll('.terminal__bar .dot');
    if (dots.length < 3 || prefersReduced) return;

    var IDLE = 'var(--dot-idle)';
    var YELLOW = '#FFDD00';
    var BLUE = '#0057B7';
    var RED = '#e5484d';
    var BLACK = '#0d0d0d';

    function sleep(ms) {
        return new Promise(function (r) { setTimeout(r, ms); });
    }
    function setAll(color) {
        dots.forEach(function (d) { d.style.background = color; });
    }
    function smooth(on) {
        dots.forEach(function (d) {
            d.style.transition = on ? 'background 0.18s ease' : 'none';
        });
    }

    async function run() {
        while (true) {
            smooth(true);
            setAll(IDLE);
            await sleep(700);

            for (var i = 0; i < dots.length; i++) {
                dots[i].style.background = YELLOW;
                await sleep(280);
            }
            await sleep(500);

            for (var b = 0; b < 6; b++) {
                setAll(b % 2 === 0 ? BLUE : YELLOW);
                await sleep(320);
            }
            await sleep(300);

            for (var j = 0; j < dots.length; j++) {
                dots[j].style.background = RED;
                await sleep(200);
            }
            await sleep(300);

            smooth(false);
            var end = Date.now() + 3000;
            while (Date.now() < end) {
                dots.forEach(function (d) {
                    d.style.background = Math.random() < 0.5 ? RED : BLACK;
                });
                await sleep(110 + Math.random() * 240);
            }

            smooth(true);
            setAll(IDLE);
            await sleep(5000);
        }
    }

    setTimeout(run, 7000);
})();
