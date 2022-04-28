import React from 'react';
import { connectField, filterDOMProps } from 'uniforms';
import classnames from 'classnames';

const Image = ({
  onChange,
  value,
  ...props
}) => (
  <div className={classnames({ onChange, value }, 'field')} {...filterDOMProps(props)}>
    <label htmlFor="file-input">
      <div>Choose your photo</div>
      <img
        alt=""
        style={{ cursor: 'pointer', width: '150px', height: '150px' }}
        src={value || 'https://picsum.photos/150?grayscale'}
      />
    </label>
    <input
      accept="image/*"
      id="file-input"
      onChange={({ target: { files } }) => {
        if (files && files[0]) {
          onChange(URL.createObjectURL(files[0]));
        }
      }}
      style={{ display: 'none' }}
      type="file"
    />
  </div>
);

export default connectField(Image);
