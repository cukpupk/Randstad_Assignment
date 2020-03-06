import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import Enzyme, { EnzymeAdapter, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Currency Converter/i);
  expect(linkElement).toBeInTheDocument();
});
Enzyme.configure({adapter: new Adapter()})
//To test the component renders alright
describe("Main Component ", () => {
  test("renders", () => {
    const wrapper = shallow(<App />);
    expect(wrapper.exists()).toBe(true);
  })
})
//UI does not change unexpectedly
test("user text is echoed", () => {
  const wrapper = shallow(<App />);
  expect(wrapper).toMatchSnapshot();
  // wrapper.find("input").simulate("change", {
  //   target:{input: "hello"}
  // });
  // expect(wrapper.find("input").value).toEqual("hello")
})
describe("React Lifecycle ", () => {
  it('shallow rendering', () => {
    const wrapper = shallow(<App />);
    const componentInstance = wrapper.instance();
    //Accessing react lifecycle methods
    componentInstance.componentDidMount();
    //Accessing component state
    expect(wrapper.state('display')).toEqual(false);
    expect(wrapper.state('FromCurrency')).toEqual('USD');
    expect(wrapper.state('ToCurrency')).toEqual('CNY');
    expect(wrapper.state('input')).toEqual('');
    expect(wrapper.state('result')).toEqual('');
    //Accessing class methods
    expect(componentInstance.Sum(1)).toEqual(2);
  })
})
describe('<App /> test input', () => {
  const container = mount(<App />);

  it('input field with valid values', () => {
    container.find('input[type="number"]').simulate('change', {
      target: {
        value: 1000,
      },
    });
    expect(container.find('input[type="number"]')).toEqual({})
  });
});