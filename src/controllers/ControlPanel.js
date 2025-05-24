/**
 * ControlPanel controller for managing UI controls and user interaction
 */
export class ControlPanel {
  /**
   * Create a new ControlPanel instance
   * @param {string} containerId ID of the container element
   */
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.controls = new Map();
  }

  /**
   * Add a slider control
   * @param {string} id Control ID
   * @param {string} label Control label
   * @param {number} min Minimum value
   * @param {number} max Maximum value
   * @param {number} value Initial value
   * @param {number} step Step value
   * @param {Function} callback Callback function
   * @returns {HTMLElement} Created slider element
   */
  addSlider(id, label, min, max, value, step, callback) {
    const controlDiv = document.createElement('div');
    controlDiv.className = 'control-item';
    controlDiv.innerHTML = `
      <label>${label} <input type="range" id="${id}" min="${min}" max="${max}" 
        step="${step}" value="${value}"><span id="${id}Val">${value}</span></label>
    `;
    this.container.appendChild(controlDiv);
    
    const slider = document.getElementById(id);
    const valueSpan = document.getElementById(id + 'Val');
    
    slider.addEventListener('input', () => {
      const val = slider.value;
      valueSpan.textContent = val;
      callback(val);
    });
    
    this.controls.set(id, { slider, valueSpan });
    return slider;
  }

  /**
   * Add a checkbox control
   * @param {string} id Control ID
   * @param {string} label Control label
   * @param {boolean} checked Initial state
   * @param {Function} callback Callback function
   * @returns {HTMLElement} Created checkbox element
   */
  addCheckbox(id, label, checked, callback) {
    const controlDiv = document.createElement('div');
    controlDiv.className = 'control-item';
    controlDiv.innerHTML = `
      <label><input type="checkbox" id="${id}" ${checked ? 'checked' : ''}> ${label}</label>
    `;
    this.container.appendChild(controlDiv);
    
    const checkbox = document.getElementById(id);
    checkbox.addEventListener('change', (e) => callback(e.target.checked));
    
    this.controls.set(id, { checkbox });
    return checkbox;
  }

  /**
   * Add a text input control
   * @param {string} id Control ID
   * @param {string} label Control label
   * @param {string} value Initial value
   * @param {Function} callback Callback function
   * @returns {HTMLElement} Created input element
   */
  addTextInput(id, label, value, callback) {
    const controlDiv = document.createElement('div');
    controlDiv.className = 'control-item';
    controlDiv.innerHTML = `
      <label>${label} <input type="text" id="${id}" value="${value}" 
        style="margin-left:8px;width:120px;"></label>
    `;
    this.container.appendChild(controlDiv);
    
    const input = document.getElementById(id);
    input.addEventListener('input', () => callback(input.value));
    
    this.controls.set(id, { input });
    return input;
  }

  /**
   * Add a separator line
   */
  addSeparator() {
    const hr = document.createElement('hr');
    hr.style = 'margin: 10px 0; border-color: #444;';
    this.container.appendChild(hr);
  }

  /**
   * Add a heading
   * @param {string} text Heading text
   */
  addHeading(text) {
    const heading = document.createElement('h3');
    heading.textContent = text;
    this.container.appendChild(heading);
  }

  /**
   * Add a theme switch control
   * @param {Function} callback Callback function
   * @returns {HTMLElement} Created switch element
   */
  addThemeSwitch(callback) {
    const controlDiv = document.createElement('div');
    controlDiv.className = 'control-item';
    controlDiv.innerHTML = `
      <label>Theme 
        <div class="theme-switch">
          <input type="checkbox" id="themeSwitch">
          <span class="slider">
            <span class="icon icon-dark">🌙</span>
            <span class="icon icon-light">☀️</span>
          </span>
        </div>
      </label>
    `;
    this.container.appendChild(controlDiv);
    
    const themeSwitch = document.getElementById('themeSwitch');
    themeSwitch.addEventListener('change', (e) => callback(e.target.checked));
    
    this.controls.set('themeSwitch', { themeSwitch });
    return themeSwitch;
  }

  /**
   * Add an animation select control
   * @param {string} id Control ID
   * @param {string} label Control label
   * @param {Array<{id: string, name: string}>} options Animation options
   * @param {Function} callback Callback function
   * @returns {HTMLElement} Created select element
   */
  addAnimationSelect(id, label, options, callback) {
    const controlDiv = document.createElement('div');
    controlDiv.className = 'control-item';
    
    const select = document.createElement('select');
    select.id = id;
    select.className = 'animation-select';
    
    options.forEach(option => {
      const opt = document.createElement('option');
      opt.value = option.id;
      opt.textContent = option.name;
      select.appendChild(opt);
    });
    
    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    labelElement.appendChild(select);
    
    controlDiv.appendChild(labelElement);
    this.container.appendChild(controlDiv);
    
    select.addEventListener('change', (e) => callback(e.target.value));
    
    this.controls.set(id, { select });
    return select;
  }
} 