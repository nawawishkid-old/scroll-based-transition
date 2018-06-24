export default class Transition {
  constructor (elem, option) {
    let handler

    this.valueFormatReplacement = '{%x%}'

    option = this.__evaluatePropValue(elem, option)

    // console.log('opt: ', option)

    if (option.range === 0 || option.range == null) {
      handler = this.scrollSpyHandler
    } else {
      option = this.scrollTransitionInit(option)
      handler = this.scrollTransitionHandler
    }

    this.elem = elem
    this.option = option

    window.addEventListener('scroll', handler.bind(this))
  }

  scrollSpyHandler () {
    if (window.scrollY >= this.option.offset) {
      if (!this.hasCalled) {
        this.option.trigger.call(this, this.elem)
        this.hasCalled = true
        this.hasReset = false
      }
    } else {
      if (!this.hasReset && this.hasCalled) {
        this.option.reset.call(this, this.elem)
        this.hasReset = true
        this.hasCalled = false
      }
    }
  }

  scrollTransitionInit (option) {
    option.scrollEnd = option.offset + option.range

    option.styles.forEach(style => {
      style.transitionRange = this.__getRange(style.startValue, style.endValue)
      style.transitionStepPerScroll = this.__getTransitionStepPerScroll(
        style.transitionRange,
        option.range
      )
    })

    return option
  }

  scrollTransitionHandler () {
    const currentYOffset = window.scrollY
    const opt = this.option

    this.detectScrollDirection()

    // console.log(this.scrollDirection)

    if (currentYOffset < opt.offset) {
      this.beforeRangeHandler(opt)
    } else if (currentYOffset >= opt.offset && currentYOffset < opt.scrollEnd) {
      this.inRangeHandler(opt)
    } else if (currentYOffset >= opt.scrollEnd) {
      this.afterRangeHandler(opt)
    }
  }

  // finishUp
  beforeRangeHandler (opt) {
    // console.log('BEFORE RANGE')

    opt.reachedStep = 1

    opt.styles.forEach(style => {
      style.transitionIsActive = false

      if (!style.transitionHasFinished && this.scrollDirection === 'Up') {
        // console.log('finishUp')
        
        // Ensure transition value accuracy
        this.stylizeDOM(style, style.startValue)
        // finishUp
        this.finishCallback.call(this, this.scrollDirection, style)
        style.transitionHasFinished = true
      }
    })
  }

  // startDown, startUp
  inRangeHandler (opt) {
    // console.log('IN RANGE')
    let result

    if (opt.reachedStep === 0 || opt.reachedStep == null) {
      this.beforeRangeHandler(opt)
    }

    opt.reachedStep = 2

    opt.styles.forEach(style => {

      // If transition has never been started, call the startCallback first.
      if (!style.transitionIsActive) {
        // console.log('start' + this.scrollDirection)
        // both startDown and startUp
        this.startCallback.call(this, this.scrollDirection, style)
        style.transitionIsActive = true
      }

      style.transitionHasFinished = false

      result = this.__getTransitionValueBasedOnScrollYOffset(
        style.startValue,
        style.transitionStepPerScroll,
        window.scrollY - opt.offset
      )

      this.stylizeDOM(style, result)
    })
  }

  // finishDown
  afterRangeHandler (opt) {
    // console.log('AFTER RANGE')

    if (opt.reachedStep < 2 || opt.reachedStep == null) {
      this.inRangeHandler(opt)
    }

    opt.reachedStep = 3

    opt.styles.forEach(style => {
      style.transitionIsActive = false

      // Ensure transition value accuracy
      this.stylizeDOM(style, style.endValue)

      if (!style.transitionHasFinished && this.scrollDirection === 'Down') {
        // console.log('finishDown')
        this.finishCallback.call(this, this.scrollDirection, style)
        style.transitionHasFinished = true
      }
    })
  }

  detectScrollDirection () {
    const prevScroll = this.prevScroll || 0

    this.scrollDirection = window.scrollY > prevScroll ? 'Down' : 'Up'
    this.prevScroll = window.scrollY
  }

  stylizeDOM (style, value) {
    // console.log(style, value)
    // console.log('FormattedValue: ', this.formatValue(style.valueFormat, value))
    this.elem.style[style.propName] = this.formatValue(style.valueFormat, value)
  }

  formatValue (format, value) {
    return this.__formatValue(format, value, this.valueFormatReplacement)
  }

  startCallback (direction, styleObj) {
    this.__runCallback.call(this, 'start', direction, styleObj)
  }

  finishCallback (direction, styleObj) {
    this.__runCallback.call(this, 'finish', direction, styleObj)
  }

  /**
   * 
   * Helper methods
   * 
   */
  __runCallback (type, direction, styleObj) {
    if (typeof styleObj[type + direction + 'Callback'] !== 'undefined') {
      styleObj[type + direction + 'Callback'].call(this, this.elem)
    }
  }

  __evaluatePropValue (elem, option) {
    for (let prop in option) {

      switch (prop) {
        case 'styles':
          option[prop].forEach((style, index) => {
            option[prop][index] = this.__evaluatePropValue(elem, style)
          })
          break

        case 'startDownCallback':
        case 'startUpCallback':
        case 'finishUpCallback':
        case 'finishDownCallback':
        case 'propName':
        case 'trigger':
        case 'reset':
          break

        default:
          if (typeof option[prop] === 'function') {
            option[prop] = option[prop].call(this, elem)
          }
          break
      }

    }

    return option
  }

  /**
   * 
   *  Functional (almost) or standalone-able methods
   * 
   * /
  /**
   * Stylize DOM
   * 
   * @param {DOM} elem Element to be stylized
   * @param {String} prop CSS property name
   * @param {Number|String} value CSS value
   */
  __stylizeDOM (elem, prop, value) {
    elem.style[prop] = value
  }

  /**
   * Format given value with given format
   * Example:
   *  - Value: 10
   *  - Format: 'translateX({%x%})'
   *  - Replacement: '{%x%}'
   * 
   *  The result is 'translateX(10)'
   * 
   * @param {String} formatString Format string
   * @param {Number} value Number to replace in format string
   * @param {String} replacement String which, exists in format string, to be replaced in format string
   */
  __formatValue (formatString, value, replacement) {
    if (formatString == null) {
      return value
    }

    return formatString.replace(replacement, value)
  }

  /**
   * Example: 
   *  - When 'X' has moved 100px, 'Y' have to move 200px. So, the result of this method is 2
   * 
   * @param {Number} transitionStartValue Initial value of CSS to be transition
   * @param {Number} transitionStepPerScroll @see Transition.__getTransitionStepPerScroll
   * @param {Number} currentSceneOffset = window.scrollY - style.offset
   */
  __getTransitionValueBasedOnScrollYOffset (
    transitionStartValue,
    transitionStepPerScroll,
    currentSceneOffset
  ) {
    return transitionStartValue + currentSceneOffset * transitionStepPerScroll
  }

  /**
   * Find the 'n' of:
   * 'x' have to transition in 'n' times of 'y'
   * 
   * @param {Number} DOMTransitionRange 
   * @param {Number} scrollRange 
   */
  __getTransitionStepPerScroll (DOMTransitionRange, scrollRange) {
    return DOMTransitionRange / scrollRange
  }

  /**
   * It's transition duration, but based on a range of scrolling
   * 
   * @param {Number} startOffset Initial offset in pixel
   * @param {Number} endOffset Destination offset in pixel
   */
  __getRange (startOffset, endOffset) {
    return endOffset - startOffset
  }
}
