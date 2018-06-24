## Intro
ผมเขียนเท่าที่จะใช้ เลยไม่สมบูรณ์นะครับ ยังไม่ได้ refactor ใด ๆ

## Usage

```js
new Transition(Element: DOMElement, Object: argObj);
```

## Arguments
**`DOMElement`**  
- type: `Element`
- desc: HTML Element

**`argObj`**  
- type: `Object`
- desc: Argument object
- `argObj.offset`:
    - type: `Number|Function`
    - desc: ตำแหน่งในแนวดิ่งของ page ที่ต้องการให้เริ่ม transition หน่วยเป็น pixel (ค่าของ `window.scrollY` นั่นแหละ)
- `argObj.range`:
    - type: `Number|Function`
    - desc: ระยะที่ต้องการให้เกิด transition (pixel) นับจาก `offset`
- `argObj.styles`:
    - type: `Array`
    - desc: Array of `styleObject`
    - `argObj.styles[n].propName` (Required):
        - type: `String`
        - desc: CSS property ที่จะใช้ในการ transition  
    - `argObj.styles[n].startValue` (Required):
        - type: `Number|Function`
        - desc: ค่าเริ่มต้นของ CSS ดังกล่าว  
    - `argObj.styles[n].endValue` (Required):
        - type: `Number|Function`
        - desc: ค่าสุดท้ายของ CSS ดังกล่าว  
    - `argObj.styles[n].valueFormat`:
        - type: `String`
        - desc: เนื่องจาก `startValue` และ `endValue` ต้องเป็น `Number` เท่านั้น CSS value ไหนที่ต้องมีหน่วยหรือมาในรูป `String` ก็จะเอา `valueFormat` นี้เป็นไป `string.replace` 
    - `argObj.styles[n].startDownCallback`:
        - type: `Function`
        - desc: Callback ที่ต้องการให้ run ก่อน transition เมื่อ user scroll ***ลง***มาถึงช่วงที่จะเกิด transition
    - `argObj.styles[n].finishDownCallback`:
        - type: `Function`
        - desc: Callback ที่ต้องการให้ run เมื่อ user scroll ***ลง***มาถึงช่วงสิ้นสุดของ transition 
    - `argObj.styles[n].startUpCallback`:
        - type: `Function`
        - desc: Callback ที่ต้องการให้ run ก่อน transition เมื่อ user scroll ***ขึ้น***มาถึงช่วงที่จะเกิด transition  
    - `argObj.styles[n].finishUpCallback`:
        - type: `Function`
        - desc: Callback ที่ต้องการให้ run เมื่อ user scroll ***ขึ้น***มาถึงช่วงสิ้นสุดของ transition  


## Example
```js
new Transition(document.getElementById('demo'), {
    offset: 100,
    range: 100,
    styles: [
        {
            propName: 'opacity',
            startValue: 0,
            endValue: 1
        },
        {
            propName: 'transform',
            valueFormat: 'translateX({%x%}px)',
            startValue: 0,
            endValue: elem => parseFloat(getComputedStyle(elem).width) / 2
        }
    ]
});
```

## Demo
https://codepen.io/nawawish_kid/pen/dKKrjN