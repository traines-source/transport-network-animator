import { Vector } from "../Vector";
import { SvgAnimator } from "./SvgAnimator";
import { SvgAbstractTimedDrawable } from "./SvgAbstractTimedDrawable";
import { BoundingBox } from "../BoundingBox";
import { CrumpledImageAdapter } from "../drawables/CrumpledImage";
import { Station } from "../drawables/Station";

export class SvgCrumpledImage extends SvgAbstractTimedDrawable implements CrumpledImageAdapter {
    private canvas: HTMLCanvasElement;
    private canvasBoundingBox: BoundingBox | undefined;
    private img: HTMLImageElement;
    private imgDimen: Vector = Vector.NULL;


    constructor(protected element: SVGGraphicsElement) {
        super(element);
        this.canvas = <HTMLCanvasElement>document.createElementNS('http://www.w3.org/1999/xhtml','canvas');
        this.img = <HTMLImageElement>document.createElementNS('http://www.w3.org/1999/xhtml', 'img');
        this.setupImage();
    }
    
    get boundingBox(): BoundingBox {
        if (this.canvasBoundingBox == undefined) {
            const r = this.element.getBBox();
            this.canvasBoundingBox = new BoundingBox(new Vector(r.x, r.y), new Vector(r.x+r.width, r.y+r.height));
        }
        return this.canvasBoundingBox;
    }

    private setupImage() {
        this.img.src = this.element.dataset.crumpledImage || "";
        this.img.style.visibility = 'hidden';
        
        this.canvas.setAttribute("width", this.boundingBox.dimensions.x+"");
        this.canvas.setAttribute("height", this.boundingBox.dimensions.y+"");
        this.element.appendChild(this.canvas);
        this.img.onload = e => {
            const ctx = this.canvas.getContext('2d');
            this.imgDimen = new Vector(this.img.width, this.img.height);
            ctx?.drawImage(this.img, 0, 0, this.boundingBox.dimensions.x, this.boundingBox.dimensions.y);
        }
        this.element.appendChild(this.img);
    }

    draw(delaySeconds: number, animationDurationSeconds: number, vertices: {src: Vector[], dst: Station[]}[]): void {
        const animator = new SvgAnimator();
        animator.wait(delaySeconds*1000, () => {
            this.element.style.visibility = 'visible';
            const ctx = this.canvas.getContext('2d');
            if (ctx != null && vertices.length > 0) {
                this.mapTriangles(vertices.map(v => ({src: v.src, dst: v.dst.map(s => s.baseCoords)})), ctx);
            }
        });
    }

    erase(delaySeconds: number): void {
        const animator = new SvgAnimator();
        animator.wait(delaySeconds*1000, () => {
            this.element.style.visibility = 'hidden';
        });
    }

    private mapTriangles(triangles: {src: Vector[], dst: Vector[]}[], ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, this.boundingBox.dimensions.x, this.boundingBox.dimensions.y);
        for (let i=0;i<triangles.length;i++) {
            const src = triangles[i].src.map(c => this.svg2ImgCoords(c));
            const dst = triangles[i].dst.map(c => this.svg2CanvasCoords(c));
            this.drawTriangle(ctx, this.img,
                dst[0], dst[1], dst[2],
                src[0], src[1], src[2]
            );
        }
    }

    private svg2ImgCoords(v: Vector) {
        const scaleX = this.imgDimen.x / this.boundingBox.dimensions.x;
        const scaleY = this.imgDimen.y / this.boundingBox.dimensions.y;
        const relSvg = this.svg2CanvasCoords(v);
        return new Vector(relSvg.x*scaleX, relSvg.y*scaleY);
    }

    private svg2CanvasCoords(v: Vector) {
        return this.boundingBox.tl.delta(v);
    }

    // inspired by http://tulrich.com/geekstuff/canvas/jsgl.js
    private drawTriangle(ctx: CanvasRenderingContext2D, im: HTMLImageElement, d0: Vector, d1: Vector, d2: Vector, s0: Vector, s1: Vector, s2: Vector) {
        ctx.save();

        ctx.beginPath();
        ctx.moveTo(d0.x, d0.y);
        ctx.lineTo(d1.x, d1.y);
        ctx.lineTo(d2.x, d2.y);
        ctx.closePath();
        //ctx.stroke();
        ctx.clip();

        var denom = s0.x * (s2.y - s1.y) - s1.x * s2.y + s2.x * s1.y + (s1.x - s2.x) * s0.y;
        if (denom == 0) {
            return;
        }
        var m11 = -(s0.y * (d2.x - d1.x) - s1.y * d2.x + s2.y * d1.x + (s1.y - s2.y) * d0.x) / denom;
        var m12 = (s1.y * d2.y + s0.y * (d1.y - d2.y) - s2.y * d1.y + (s2.y - s1.y) * d0.y) / denom;
        var m21 = (s0.x * (d2.x - d1.x) - s1.x * d2.x + s2.x * d1.x + (s1.x - s2.x) * d0.x) / denom;
        var m22 = -(s1.x * d2.y + s0.x * (d1.y - d2.y) - s2.x * d1.y + (s2.x - s1.x) * d0.y) / denom;
        var dx = (s0.x * (s2.y * d1.x - s1.y * d2.x) + s0.y * (s1.x * d2.x - s2.x * d1.x) + (s2.x * s1.y - s1.x * s2.y) * d0.x) / denom;
        var dy = (s0.x * (s2.y * d1.y - s1.y * d2.y) + s0.y * (s1.x * d2.y - s2.x * d1.y) + (s2.x * s1.y - s1.x * s2.y) * d0.y) / denom;

        ctx.transform(m11, m12, m21, m22, dx, dy);
        ctx.drawImage(im, 0, 0);
        ctx.restore();
    };

}