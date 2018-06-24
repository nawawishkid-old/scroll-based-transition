## Usage

```js
new Transition(Element: DOMElement, Object: argumentObject);
```

## Arguments
**`DOMElement`**  
- type: `Element`

**`argumentObject`**  
- type: `Object`
- properties:
    - `offset`:
        ตำแหน่งในแนวดิ่งของ page ที่ต้องการให้เริ่ม transition หน่วยเป็น pixel (ค่าของ `window.scrollY` นั่นแหละ)
    - `range`:
        ระยะที่ต้องการให้เกิด transition (pixel) นับจาก `offset`
    - `propName`:
        CSS property ที่จะใช้ในการ transition  
    - `startValue`:
        ค่าเริ่มต้นของ CSS ดังกล่าว  
    - `endValue`:
        ค่าสุดท้ายของ CSS ดังกล่าว  
    - `startDownCallback`:
        Callback ที่ต้องการให้ run ก่อน transition เมื่อ user scroll ***ลง***มาถึงช่วงที่จะเกิด transition
    - `finishDownCallback`:
        Callback ที่ต้องการให้ run เมื่อ user scroll ***ลง***มาถึงช่วงสิ้นสุดของ transition
    - `startUpCallback`:
        Callback ที่ต้องการให้ run ก่อน transition เมื่อ user scroll ***ขึ้น***มาถึงช่วงที่จะเกิด transition
    - `finishUpCallback`:
        Callback ที่ต้องการให้ run เมื่อ user scroll ***ขึ้น***มาถึงช่วงสิ้นสุดของ transition

## Example
```js
new Transition(document.getElementById('demo'), {
    offset: 100,
    range: 100,
    propName: 'opacity',
    startValue: 0,
    endValue: 1
});
```

## Demo
