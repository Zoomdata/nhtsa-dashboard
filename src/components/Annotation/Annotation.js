import styles from './Annotation.css';

import React, { Component } from 'react';
import zdLogo from '../../images/ZoomdataLogo.png';
import nhtsaLogo from '../../images/NHTSALogo.png';

export default class Annotation extends Component {
    render() {
        return <div className={styles.root}>
            <div>
                Made by <img width="109" height="40" src={zdLogo} />
            </div>
            <div>
                With Data From <img width="69" height="39" src={nhtsaLogo} />
            </div>
        </div>
    }
}