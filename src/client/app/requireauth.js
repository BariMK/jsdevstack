import React from 'react'
import {RouterExposedComponent} from '../../lib/components/base'

export default function requireAuth(BaseComponent) {

  return class RequireAuth extends RouterExposedComponent {


    static willTransitionTo(transition) {
      if (isUserLogged()) return;
      transition.redirect('/login', {}, {
        nextPath: transition.path
      });
    }

    render() {
      return <BaseComponent {...this.props} />;
    }

  };

}
