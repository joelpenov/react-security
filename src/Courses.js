import React from "react";
import "./Auth0/spinner.css";

export default class Courses extends React.Component {
  state = {
    courses: null
  };

  componentDidMount() {
    fetch("/courses", {
      headers: {
        Authorization: `Bearer ${this.props.auth0.getAccessToken()}`
      }
    })
      .then(response => {
        if (response.ok) return response.json();
        console.log(response);
      })
      .then(response => {
        this.setState({ courses: response.courses });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <div>
        {!this.state.courses && <div className="loader" />}
        {this.state.courses && (
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {this.state.courses.map(course => {
                return (
                  <tr key={course.id}>
                    <td>{course.id}</td>
                    <td>{course.title}</td>
                    <td>{course.category}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}
