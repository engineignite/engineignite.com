# Design source

The vendored copy of the Engine Ignite design handoff, so the repo explains itself without the
original scratch directory.

| File                                                       | What it is                                                                                   |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| [`handoff.md`](handoff.md)                                 | The handoff: direction 2A ("Panel"), every measurement, copy and behavior note               |
| [`modernist-design-system.md`](modernist-design-system.md) | The design system's own guidance. Read the Do / Don't section before deviating               |
| [`styles.reference.css`](styles.reference.css)             | The original token sheet. **Reference only**: the live tokens are in `src/styles/global.css` |

`styles.reference.css` is not loaded by the site. It is kept so the ported values can be diffed
against their source. If the designer reissues it, port the changes into `src/styles/global.css`
and note them in [`../adr/0003-modernist-design-system.md`](../adr/0003-modernist-design-system.md).

The interactive prototype (`Engine Ignite Landing.dc.html`) is not vendored: it is a
prototyping-format file that does not render outside the design tool, and every value in it is
already written down in `handoff.md`.
