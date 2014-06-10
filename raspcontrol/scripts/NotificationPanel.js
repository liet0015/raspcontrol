/** @jsx React.DOM */
var NotificationField = React.createClass({
    addNotification: function(notifications) {
     // var notifications = this.state.data;
        //var newNotifications = notifications.concat([notification]);

        this.setState({data: notifications});
    },
    getInitialState: function() {
        return {data: []};
    },
    componentWillMount: function() {
        var socket = io.connect("http://localhost");
        var self = this;
        socket.on('connect', function(){
            socket.on('server_message', function(notifications){
                console.log("Server Message received: " + notifications);
                self.addNotification(notifications);
            });

            socket.on('disconnect', function(){});
        });

    },
    render: function() {


        var title = (
            <h3 className="panel-title">{this.props.maintitle}</h3>
            );

        var notificationNodes = this.state.data.map(function (notif) {
            return  <div className={notif.level}>
            <div className="row">

            <div className="col-lg-4">


                <p className="list-group-item-text" key="{notif._id}">{notif.time}</p>

                </div>
                <div className="col-lg-4">


                <p className="list-group-item-text" key="{notif._id}">{notif.message}</p>

                    </div>

                </div>
                </div>;
        });

        return (

            <div className="panel panel-primary">
                <div className="panel-heading">
                    {title}
                </div>
                <div class="panel-body">
                    <div className="alert alert-info">
                    <div className="row">
                        <div className="col-lg-4">
                            <strong>Time received</strong>
                        </div>
                        <div className="col-lg-4">
                            <strong>Message</strong>
                         </div>
                        </div>
                     </div>
                    {notificationNodes}
                </div>
            </div>
            );
    }


});
