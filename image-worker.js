/* Restaurador de Fotos Antiguas — Image Processing Worker v2.0 */

self.onmessage = function (event) {
    const { type, jobId, width, height, buffer, options } = event.data;
    if (type !== 'process') return;

    try {
        let data = new Uint8ClampedArray(buffer);
        data = processPixels(data, width, height, options);
        self.postMessage(
            { type: 'result', jobId, width, height, buffer: data.buffer },
            [data.buffer]
        );
    } catch (error) {
        self.postMessage({
            type: 'error',
            jobId,
            message: error?.message || String(error)
        });
    }
};

function processPixels(data, width, height, options) {
    const {
        yellowFix, temp, tint, brightness, contrastFactor,
        redBoost, satVal, sharpness, noiseReduction,
        scratchRepair, colorRestore
    } = options;

    if (colorRestore > 0) applyGrayWorld(data, colorRestore);
    if (noiseReduction > 0) data = boxBlurBlend(data, width, height, noiseReduction);

    for (let i = 0; i < data.length; i += 4) {
        let r=data[i], g=data[i+1], b=data[i+2];

        if (yellowFix > 0) {
            const yellowTint=Math.min(r,g)-b;
            if (yellowTint > 0) {
                b += yellowTint*yellowFix*0.85;
                g -= yellowTint*yellowFix*0.2;
                r -= yellowTint*yellowFix*0.1;
            }
        }

        r += temp*0.8; b -= temp*0.8; g -= tint*0.8;
        r += brightness; g += brightness; b += brightness;

        r=contrastFactor*(r-128)+128;
        g=contrastFactor*(g-128)+128;
        b=contrastFactor*(b-128)+128;

        if (redBoost > 0 && r > g*1.2 && r > b*1.2) {
            r += (r-Math.max(g,b))*redBoost*0.6;
        }

        const gray=0.2989*r+0.5870*g+0.1140*b;
        r=gray+satVal*(r-gray);
        g=gray+satVal*(g-gray);
        b=gray+satVal*(b-gray);

        data[i]=clamp(r); data[i+1]=clamp(g); data[i+2]=clamp(b);
    }

    if (scratchRepair > 0) data=repairScratches(data,width,height,scratchRepair);
    if (sharpness > 0) data=unsharpSafe(data,width,height,sharpness/100);
    return data;
}

function applyGrayWorld(data,strength) {
    let sumR=0,sumG=0,sumB=0,count=0;
    for(let i=0;i<data.length;i+=16){
        sumR+=data[i]; sumG+=data[i+1]; sumB+=data[i+2]; count++;
    }
    if(!count)return;
    const avg=(sumR+sumG+sumB)/3;
    const kr=avg/Math.max(1,sumR/count);
    const kg=avg/Math.max(1,sumG/count);
    const kb=avg/Math.max(1,sumB/count);
    for(let i=0;i<data.length;i+=4){
        data[i]=clamp(data[i]*(1+(kr-1)*strength));
        data[i+1]=clamp(data[i+1]*(1+(kg-1)*strength));
        data[i+2]=clamp(data[i+2]*(1+(kb-1)*strength));
    }
}

function boxBlurBlend(src,w,h,strength) {
    const out=new Uint8ClampedArray(src);
    for(let y=0;y<h;y++) for(let x=0;x<w;x++){
        const idx=(y*w+x)*4;
        let sr=0,sg=0,sb=0,n=0;
        for(let dy=-1;dy<=1;dy++){
            const yy=y+dy;if(yy<0||yy>=h)continue;
            for(let dx=-1;dx<=1;dx++){
                const xx=x+dx;if(xx<0||xx>=w)continue;
                const ni=(yy*w+xx)*4;
                sr+=src[ni];sg+=src[ni+1];sb+=src[ni+2];n++;
            }
        }
        out[idx]=clamp(src[idx]*(1-strength)+(sr/n)*strength);
        out[idx+1]=clamp(src[idx+1]*(1-strength)+(sg/n)*strength);
        out[idx+2]=clamp(src[idx+2]*(1-strength)+(sb/n)*strength);
    }
    return out;
}

function repairScratches(src,w,h,strength) {
    const out=new Uint8ClampedArray(src);
    for(let y=1;y<h-1;y++) for(let x=1;x<w-1;x++){
        const idx=(y*w+x)*4;
        const center=(src[idx]+src[idx+1]+src[idx+2])/3;
        const li=idx-4,ri=idx+4,ui=idx-w*4,di=idx+w*4;
        const left=(src[li]+src[li+1]+src[li+2])/3;
        const right=(src[ri]+src[ri+1]+src[ri+2])/3;
        const up=(src[ui]+src[ui+1]+src[ui+2])/3;
        const down=(src[di]+src[di+1]+src[di+2])/3;
        const neighborhood=(left+right+up+down)/4;
        if(Math.abs(center-neighborhood)>70){
            out[idx]=clamp(src[idx]*(1-strength)+neighborhood*strength);
            out[idx+1]=clamp(src[idx+1]*(1-strength)+neighborhood*strength);
            out[idx+2]=clamp(src[idx+2]*(1-strength)+neighborhood*strength);
        }
    }
    return out;
}

function unsharpSafe(src,w,h,amount) {
    const dst=new Uint8ClampedArray(src);
    const weights=[0,-1,0,-1,5,-1,0,-1,0];
    for(let y=1;y<h-1;y++) for(let x=1;x<w-1;x++){
        const idx=(y*w+x)*4;
        for(let c=0;c<3;c++){
            let v=0;
            v+=src[((y-1)*w+x-1)*4+c]*weights[0];
            v+=src[((y-1)*w+x)*4+c]*weights[1];
            v+=src[((y-1)*w+x+1)*4+c]*weights[2];
            v+=src[(y*w+x-1)*4+c]*weights[3];
            v+=src[idx+c]*weights[4];
            v+=src[(y*w+x+1)*4+c]*weights[5];
            v+=src[((y+1)*w+x-1)*4+c]*weights[6];
            v+=src[((y+1)*w+x)*4+c]*weights[7];
            v+=src[((y+1)*w+x+1)*4+c]*weights[8];
            dst[idx+c]=clamp(src[idx+c]+(v-src[idx+c])*amount);
        }
    }
    return dst;
}

function clamp(v){return Math.max(0,Math.min(255,v));}
