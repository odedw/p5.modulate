import * as modulate from "./src";
p5.prototype.modulate = modulate;
p5.prototype.registerMethod("pre", p5.prototype.modulate.onDraw);
