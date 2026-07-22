/* JavaScript Kitchen — terminal boot sequence.
   Progressive enhancement: the page is fully rendered and readable without
   this script. When motion is welcome, we retype the command lines and
   stagger-reveal the output for a "cold boot" feel. Bail out entirely for
   visitors who prefer reduced motion. */
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

    // Stash the real text, then clear so we can type it back in.
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
        // Leave the prompt cursor blinking — the terminal stays "alive".
    }

    boot();
})();
