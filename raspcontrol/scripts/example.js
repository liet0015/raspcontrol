/** @jsx React.DOM */



//var Panel = require('react-bootstrap').Panel;





var MainPage = React.createClass({


    render: function() {
        console.log("WHY3!!!!");
        return (
            <div className="row">
                <h1>Control</h1>
                <div className="col-sm-4">
                    <div>
                        </div>
                    </div>
                <div className="col-sm-4">
                    <div>
                    <NotificationForm maintitle="Control Form" buttonname="Send update"/>
                    </div>
                </div>
                <div className="col-sm-4">
                    <NotificationField maintitle="Notifications" url="notifications"/>
                 </div>
            </div>
            );
    }

});




React.renderComponent(
    <MainPage />, document.getElementById('container'));
