import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import GUI from '../containers/gui.jsx';
import {setStageSize} from '../reducers/stage-size';
import {STAGE_SIZE_MODES} from '../lib/layout-constants';

import styles from './player.css';

class Player extends React.Component {
    componentDidMount() {
        this.props.setStageSize();
    }

    adjustWidth() {
        this.width = window.innerWidth;
        if (this.width > 640) {
            this.width = 640;
        }
        // 不要填满屏幕宽度
        this.width -= 10;
    }

    render() {
        this.adjustWidth();

        return (
        <div className={styles.stageOnly} style={{width: this.width + 'px'}}>
            <GUI
                projectId={this.props.projectId}
            />
        </div>
        );
    }
}

Player.propTypes = {
    projectId: PropTypes.string
};

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
    setStageSize: () => dispatch(setStageSize(STAGE_SIZE_MODES.fullWidth))
});

const ConnectedPlayer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Player);

export default ConnectedPlayer;
