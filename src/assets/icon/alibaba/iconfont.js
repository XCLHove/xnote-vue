(window._iconfont_svg_string_4450125 =
    '<svg><symbol id="icon-menu" viewBox="0 0 1249 1024"><path d="M1186.816 124.928H62.464C27.648 124.928 0 97.28 0 62.464S27.648 0 62.464 0h1124.352c33.792 0 62.464 27.648 62.464 62.464s-28.672 62.464-62.464 62.464z m0 449.536H62.464C27.648 574.464 0 546.816 0 512s27.648-62.464 62.464-62.464h1124.352c33.792 0 62.464 27.648 62.464 62.464s-28.672 62.464-62.464 62.464z m0 449.536H62.464C27.648 1024 0 996.352 0 961.536s27.648-62.464 62.464-62.464h1124.352c33.792 0 62.464 27.648 62.464 62.464S1220.608 1024 1186.816 1024z" fill="#515151" ></path></symbol></svg>'),
    (function (n) {
        var t = (t = document.getElementsByTagName("script"))[t.length - 1],
            e = t.getAttribute("data-injectcss"),
            t = t.getAttribute("data-disable-injectsvg");
        if (!t) {
            var o,
                i,
                c,
                s,
                d,
                a = function (t, e) {
                    e.parentNode.insertBefore(t, e);
                };
            if (e && !n.__iconfont__svg__cssinject__) {
                n.__iconfont__svg__cssinject__ = !0;
                try {
                    document.write(
                        "<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>",
                    );
                } catch (t) {
                    console && console.log(t);
                }
            }
            (o = function () {
                var t,
                    e = document.createElement("div");
                (e.innerHTML = n._iconfont_svg_string_4450125),
                    (e = e.getElementsByTagName("svg")[0]) &&
                        (e.setAttribute("aria-hidden", "true"),
                        (e.style.position = "absolute"),
                        (e.style.width = 0),
                        (e.style.height = 0),
                        (e.style.overflow = "hidden"),
                        (e = e),
                        (t = document.body).firstChild
                            ? a(e, t.firstChild)
                            : t.appendChild(e));
            }),
                document.addEventListener
                    ? ~["complete", "loaded", "interactive"].indexOf(
                          document.readyState,
                      )
                        ? setTimeout(o, 0)
                        : ((i = function () {
                              document.removeEventListener(
                                  "DOMContentLoaded",
                                  i,
                                  !1,
                              ),
                                  o();
                          }),
                          document.addEventListener("DOMContentLoaded", i, !1))
                    : document.attachEvent &&
                      ((c = o),
                      (s = n.document),
                      (d = !1),
                      r(),
                      (s.onreadystatechange = function () {
                          "complete" == s.readyState &&
                              ((s.onreadystatechange = null), l());
                      }));
        }
        function l() {
            d || ((d = !0), c());
        }
        function r() {
            try {
                s.documentElement.doScroll("left");
            } catch (t) {
                return void setTimeout(r, 50);
            }
            l();
        }
    })(window);