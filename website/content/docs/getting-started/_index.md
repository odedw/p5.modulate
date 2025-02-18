---
date: '2025-02-18T08:28:19-06:00'
draft: true
title: 'Getting Started'
linkTitle: 'Getting Started'
weight: 1
description: >
  Installation and basic setup of p5.modulate
---

## Installation

You can install p5.modulate using npm:

```bash
npm install p5.modulate
```

## Basic Setup

Add p5.modulate to your project:

```javascript
import * as p5mod from 'p5.modulate';
```

Or import specific components:

```javascript
import { createEnvelope, createLfo, createTimeFunction, createSequencer } from 'p5.modulate';
```

## Next Steps

Explore the core components of p5.modulate:

- [Time Functions](../time-function) - Control timing and easing
- [LFO](../lfo) - Create cyclic modulations
- [Envelope](../envelope) - Shape values over time
- [Sequencer](../sequencer) - Create complex patterns
