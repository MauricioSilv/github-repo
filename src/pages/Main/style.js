import styled, { keyframes, css } from 'styled-components';

export const Form = styled.form`
  margin-top: 30px;
  display: flex;
  flex-direction: row;

  input {
    flex: 1;
    border: 1px solid ${props => props.errorColor || '#eee'};
    padding: 10px 15px;
    border-radius: 4px;
    font-size: 16px;
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to{
    transform: rotate(360deg);
  }
`;

// export const HandleError = styled.div.attrs(props => ()`
//   $

// `;

export const SubmitButton = styled.button.attrs(props => ({
  type: 'submit',
  disabled: props.loading !== 'false',
}))`
  background: #560e02;
  border: 0;
  padding: 0 15px;
  margin-left: 10px;
  border-radius: 4px;

  display: flex;
  justify-content: center;
  align-items: center;

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.6;
  }

  ${props =>
    props.loading !== 'false' &&
    css`
      svg {
        animation: ${rotate} 2s linear infinite;
      }
    `}
`;

export const List = styled.ul`
  list-style: none;
  margin-top: 30px;

  li {
    border-left-color: red;
    border-left-style: inset;
    border-left-width: 5px;
    display: flex;
    margin: 5px;
    padding: 15px 7px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  a {
    color: #560e02;
    text-decoration: none;
  }
`;
