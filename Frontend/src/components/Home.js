import React, { Component } from 'react';

export class Home extends Component {
  static displayName = Home.name;

  render() {
    return (
      <div>
        <h1>Графы</h1>
        <p>Используется:</p>
        <ul>
          <li><a href='https://get.asp.net/'>ASP.NET Core</a> и <a href='https://msdn.microsoft.com/en-us/library/67ef8sbd.aspx'>C#</a> для Бэкенд</li>
          <li><a href='https://reactjs.org/'>React</a> для Фротенда</li>
          <li><a href='http://getbootstrap.com/'>Bootstrap</a> для стилей</li>
          <li><a href='http://getbootstrap.com/'>D3</a> для визуализации графа</li>
        </ul>
        <p>Станицы:</p>
        <ul>
          <li><strong>Счётчик</strong>. Для проверки навигации и React.</li>
          <li><strong>Проверка WebAPI</strong>. Для проверки доступности Бэкенда.</li>
          <li><strong>Граф</strong>. Для получения и отображения графа с Бэкенда.</li>
        </ul>
        <p>The <code>ClientApp</code> subdirectory is a standard React application based on the <code>create-react-app</code> template. If you open a command prompt in that directory, you can run <code>npm</code> commands such as <code>npm test</code> or <code>npm install</code>.</p>
      </div>
    );
  }
}
