// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="Introduction.html">Introduction</a></li><li class="chapter-item expanded affix "><li class="part-title">Setup and Installation</li><li class="chapter-item expanded "><a href="SetupAndInstall/VS Code.html"><strong aria-hidden="true">1.</strong> VS Code</a></li><li class="chapter-item expanded "><a href="SetupAndInstall/Git.html"><strong aria-hidden="true">2.</strong> Git</a></li><li class="chapter-item expanded "><a href="SetupAndInstall/Project Structure.html"><strong aria-hidden="true">3.</strong> Project Structure</a></li><li class="chapter-item expanded "><a href="SetupAndInstall/UV.html"><strong aria-hidden="true">4.</strong> UV</a></li><li class="chapter-item expanded affix "><li class="part-title">Server</li><li class="chapter-item expanded "><a href="Server/Server.html"><strong aria-hidden="true">5.</strong> Introduction</a></li><li class="chapter-item expanded "><a href="Server/FastAPI Hello World.html"><strong aria-hidden="true">6.</strong> Project Setup</a></li><li class="chapter-item expanded "><a href="Server/Pytest Setup.html"><strong aria-hidden="true">7.</strong> Pytest Setup</a></li><li class="chapter-item expanded "><a href="Server/Numpy Docs and Sphinx Setup.html"><strong aria-hidden="true">8.</strong> Numpy Docs and Spinx Setup</a></li><li class="chapter-item expanded affix "><li class="part-title">Appendix</li><li class="chapter-item expanded "><div><strong aria-hidden="true">9.</strong> VS Code</div></li><li><ol class="section"><li class="chapter-item expanded "><a href="Appendix/VS Code Configs.html"><strong aria-hidden="true">9.1.</strong> VS Code Configs</a></li><li class="chapter-item expanded "><a href="Appendix/VS Code Extensions.html"><strong aria-hidden="true">9.2.</strong> VS Code Extensions</a></li><li class="chapter-item expanded "><a href="Appendix/VS Code Trouble Shooting.html"><strong aria-hidden="true">9.3.</strong> VS Code Trouble Shooting</a></li></ol></li><li class="chapter-item expanded "><div><strong aria-hidden="true">10.</strong> Git</div></li><li><ol class="section"><li class="chapter-item expanded "><a href="Appendix/Git Cheat Sheet.html"><strong aria-hidden="true">10.1.</strong> Git Cheat Sheet</a></li><li class="chapter-item expanded "><a href="Appendix/Git Trouble Shoot.html"><strong aria-hidden="true">10.2.</strong> Git Trouble Shooting</a></li><li class="chapter-item expanded "><a href="Appendix/Git Ignores.html"><strong aria-hidden="true">10.3.</strong> Git Ignores</a></li></ol></li><li class="chapter-item expanded "><div><strong aria-hidden="true">11.</strong> Scripting</div></li><li><ol class="section"><li class="chapter-item expanded "><a href="Appendix/Powershell Cheat Sheet.html"><strong aria-hidden="true">11.1.</strong> Powershell Cheat Sheet</a></li><li class="chapter-item expanded "><a href="Appendix/Bash Cheat Sheet.html"><strong aria-hidden="true">11.2.</strong> Bash Cheat Sheet</a></li></ol></li><li class="chapter-item expanded "><div><strong aria-hidden="true">12.</strong> Python</div></li><li><ol class="section"><li class="chapter-item expanded "><a href="Appendix/Python Cheat Sheet.html"><strong aria-hidden="true">12.1.</strong> Python Cheat Sheet</a></li><li class="chapter-item expanded "><a href="Appendix/Python Trouble Shoot.html"><strong aria-hidden="true">12.2.</strong> Python Trouble Shoot</a></li><li class="chapter-item expanded "><a href="Appendix/Python Configs.html"><strong aria-hidden="true">12.3.</strong> Python Configs</a></li><li class="chapter-item expanded "><a href="Appendix/Server Structure.html"><strong aria-hidden="true">12.4.</strong> Server Structure</a></li></ol></li><li class="chapter-item expanded "><div><strong aria-hidden="true">13.</strong> App</div></li><li><ol class="section"><li class="chapter-item expanded "><a href="Appendix/API Reference.html"><strong aria-hidden="true">13.1.</strong> API Reference</a></li><li class="chapter-item expanded "><a href="Appendix/Common Build and Run Commands.html"><strong aria-hidden="true">13.2.</strong> Common Build and Run Commands</a></li><li class="chapter-item expanded "><a href="Appendix/Database Structure.html"><strong aria-hidden="true">13.3.</strong> Database Structure</a></li><li class="chapter-item expanded "><a href="Appendix/Project Directory Structure.html"><strong aria-hidden="true">13.4.</strong> Project Directory Structure</a></li></ol></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
