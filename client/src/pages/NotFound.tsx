import * as React from 'react';
import classes from './NotFound.module.css';

export const NotFound = () => {
    const onClickHandler = () => {
        window.location.href = '/';
    };
    return (
        <div className={classes.wrapper}>
            <div
                className={classes.container}
                data-text='404'
                onClick={onClickHandler}>
                <div
                    className={`${classes.title} ${classes.glitch}`}
                    data-text='404'>
                    404
                </div>
                <div
                    className={`${classes.description} ${classes.glitch}`}
                    data-text='PAGE NOT FOUND'>
                    PAGE NOT FOUND
                </div>
                {/* <Link
                    as={ReactLink}
                    to='/home'
                    className={classes.glitch}
                    variant='primary'
                    margin={[3, 4, 8]}>
                    Go to Home
                </Link> */}
            </div>
        </div>
    );
};
