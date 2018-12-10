import React, {Component} from 'react'
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PopupState, {bindTrigger, bindMenu} from 'material-ui-popup-state/index';

class SelectionChip extends Component {
    constructor(props) {
        super(props);

        let state = {};

        const {data, variable} = props;

        if (variable.value === data.value) {
            state.mode = data;
            state.selected = true;
        } else if (data.alt && data.alt.length > 0) {
            data.alt.map((alt) => {
                if (variable.value === alt.value) {
                    state.mode = alt;
                    state.selected = true;
                }

                return null;
            });


        }

        if(!state.mode){
            state.mode = data;
            state.selected = false;
        }

        this.state = state;
    }

    checkSelected = () => {
        const {data, variable} = this.props;

        if (variable.value === data.value) {
            return true;
        }

        if (data.alt && data.alt.length > 0) {
            for (let i = 0; i < data.alt.length; i++) {
                if (variable.value === data.alt[i].value) {
                    return true;
                }
            }
        }

        return false;
    };

    handleChange = (name, mode, popupState) => {
        this.props.onChange(name, mode.value);

        this.setState({
            mode,
            selected: true
        });

        if (popupState) {
            popupState.close();
        }
    };

    render() {
        const dropDown = (
            <PopupState variant="popover"
                        popupId={`demo-popup-menu-${this.props.data.label}-${Math.random().toString()}`}

            >
                {popupState => (
                    <React.Fragment>
                        <Button variant="contained" {...bindTrigger(popupState)}
                                className={this.checkSelected() ? 'selection-chip active' : 'selection-chip'}>
                            {this.state.mode.label}
                        </Button>
                        <Menu {...bindMenu(popupState)}>
                            <MenuItem
                                onClick={() => this.handleChange(this.props.variable.name, this.props.data, popupState)}>{this.props.data.label}</MenuItem>
                            {this.props.data.alt.map((alt) => {
                                return <MenuItem onClick={() => this.handleChange(this.props.variable.name, alt, popupState)}
                                                 key={alt.label}>{alt.label}</MenuItem>
                            })}

                        </Menu>
                    </React.Fragment>
                )}
            </PopupState>);

        const single = (
            <Button variant="contained"
                    onClick={() => this.handleChange(this.props.variable.name, this.props.data)}
                    className={this.checkSelected() ? 'selection-chip active' : 'selection-chip'}
            >
                {this.state.mode.label}
            </Button>
        );

        return (
            this.props.data.alt ? dropDown : single
        );
    }
}

export default SelectionChip;