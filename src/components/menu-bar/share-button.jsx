import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import Button from '../button/button.jsx';

import styles from './share-button.css';

const ShareButton = ({
    className,
    onClick,
}) => (
    <Button
        className={classNames(
            className,
            styles.shareButton
        )}
        onClick={onClick}
    >
        上传作品
    </Button>
);

ShareButton.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func
};

ShareButton.defaultProps = {
    onClick: () => {}
};

export default ShareButton;
