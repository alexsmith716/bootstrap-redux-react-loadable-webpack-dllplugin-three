import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
//import LoginForm from '../../components/LoginForm/LoginForm';
import * as authActions from '../../redux/modules/auth';
import * as notifActions from '../../redux/modules/notifs';
// import GithubLogin from 'components/GithubLogin/GithubLogin';
//import FacebookLogin from '../../components/FacebookLogin/FacebookLogin';

// const styles = require('./scss/Login.scss');
// const googleIcon = require('../../components/GoogleLogin/images/icon-google.png');

@connect(state => ({ user: state.auth.user }), { ...notifActions, ...authActions })

export default class Login extends Component {

  static propTypes = {
    user: PropTypes.shape({ email: PropTypes.string }),
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    notifSend: PropTypes.func.isRequired,
  };

  static defaultProps = {
    user: null
  };

  onFacebookLogin = async (err, data) => {
    if (err) return;

    try {
      await this.props.login(data);
      this.successLogin();
    } catch (error) {
      if (error.message === 'Incomplete oauth registration') {
        this.context.router.push({
          pathname: '/register',
          state: { oauth: error.data }
        });
      } else {
        throw error;
      }
    }
  };

  login = async data => {
    const result = await this.props.login('local', data);
    this.successLogin();
    return result;
  };

  successLogin = () => {
    this.props.notifSend({
      message: "You're logged in now !",
      kind: 'success',
      dismissAfter: 2000
    });
  };

  FacebookLoginButton = ({ facebookLogin }) => (
    <div>
      <a href="#"  onClick={facebookLogin}>
        Facebook
      </a>
    </div>
  );


  render() {

    const { user, logout } = this.props;
    const styles = require('./scss/Login.scss');
    const googleIcon = require('../../components/GoogleLogin/images/icon-google.png');

    return (

      <div>

        <div>

          <Helmet title="Login" />  

          {!user && (

            <div>

              <div>

                <div>
                  <p>
                    Sign in to Election App
                  </p>
                </div>

                <div>

                  <div>
                    <p>Or sign in with</p>
                  </div>

                  <div>

                    <div>
                      <a href="#">
                        <img src={googleIcon} alt="Google Login" />
                        Google
                      </a>
                    </div> 

                  </div>

                </div>

                <div>
                  <div>
                    Not a member?
                    <a href="/join?source=login">Create an account</a>.
                  </div>
                </div> 

              </div>

            </div>

          )}

          {user && (

            <div>

              <div>You are currently logged in as Elmer Fudddd. Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.</div>

              <div>
                <button onClick={logout}>
                  Log Out
                </button>
              </div>
            </div>

          )}

        </div>
      </div>
    );
  }
};
