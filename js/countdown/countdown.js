/** @jsx React.DOM */
var CountdownTimer = React.createClass({displayName: "CountdownTimer",
    getInitialState: function () {
        return {
            secondsRemaining: 10
        };
    },
    
    tick: function () {
        this.setState({
            secondsRemaining: this.state.secondsRemaining - 1
        });
        $("#clockbtn").text("倒计时("+ this.state.secondsRemaining + ")");
        if (this.state.secondsRemaining <= 0) {
            $("#clockbtn").text("验证");
            $("#clockbtn").removeAttr('disabled');
            clearInterval(this.interval);
        }
    },

    onClickStart: function () {
        this.setState({
            secondsRemaining: this.props.secondsRemaining
        });
        
        $("#clockbtn").text("倒计时("+ this.state.secondsRemaining + ")");
        
        this.interval = setInterval(this.tick, 1000);
        $("#clockbtn").attr({'disabled':'disabled'});
        
    },
    
    componentDidMount: function () {
        return {
            secondsRemaining: 10
        };
    },
    
    componentWillUnmount: function () {
        clearInterval(this.interval);
    },
    
    render: function () {
        return ( React.createElement("button", {type: "button", id: "clockbtn", 
            className: "btn btn-danger", 
            onClick: this.onClickStart}, "验证")
        );
    }
});

React.render(
    React.createElement(CountdownTimer, {secondsRemaining: "10"}),
    document.getElementById('output')
);