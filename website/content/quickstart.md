---
title: "Quick Start"
weight: 5
menu:
  main:
    weight: 5
---

# Getting Started with p5.modulate

## Installation

```javascript
npm install p5.modulate
```

## Quick Example

```javascript
import { createEnvelope } from 'p5.modulate';

// Create a simple envelope
const fadeIn = createEnvelope({
  attack: 1.0,
  decay: 0.5,
  sustain: 0.8,
  release: 2.0
});
```

## Prerequisites

To get started with p5.modulate, you'll need:

1. A basic understanding of p5.js
2. p5.modulate installed in your project
3. Some creativity and curiosity!

## Next Steps

After installation, explore the core components:
- Time Functions - Control timing and easing
- LFO - Create cyclic modulations
- Envelope - Shape values over time
- Sequencer - Create complex patterns 