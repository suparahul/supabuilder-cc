# Branding — Reference

Read this at the start of `/supabuilder:init`, `/supabuilder:status`, and `/supabuilder:settings` to display the branded header.

---

## ASCII Header

Output this exactly (monospace block):

```
 ███████╗██╗   ██╗██████╗  █████╗
 ██╔════╝██║   ██║██╔══██╗██╔══██╗
 ███████╗██║   ██║██████╔╝███████║
 ╚════██║██║   ██║██╔═══╝ ██╔══██║
 ███████║╚██████╔╝██║     ██║  ██║
 ╚══════╝ ╚═════╝ ╚═╝     ╚═╝  ╚═╝
          B U I L D E R
```

**Version:** `v0.2.3`

---

## Taglines

Pick one at random each time. Output it below the header in italics.

1. "Your product team in a terminal."
2. "Ship it before the standup."
3. "Six agents. One vision. Zero meetings."
4. "Product-first. Always."
5. "From idea to deployed — no ticket required."
6. "The PM that never sleeps."
7. "Less process, more product."
8. "Think big, ship small, iterate fast."
9. "Your codebase, understood."
10. "Build what matters. Skip what doesn't."
11. "Agents argue so you don't have to."
12. "Where diagrams become deployments."
13. "All the product thinking. None of the overhead."
14. "Move fast and document things."
15. "The orchestrator is listening."

---

## Usage

Output the header block, then the version and a random tagline on the same line:

```
{ASCII header}

v0.2.3 — "{random tagline}"
```

Then proceed with the skill's actual output (separated by a blank line).
