/** @jsx React.DOM */
var NotificationForm = React.createClass({
    handleSubmit: function () {
        var message = this.refs.message.getDOMNode().value.trim();

            var socket = io.connect("http://localhost");
            var self = this;

            socket.emit('notification_to_bi',message);
        },

    render: function() {


        var title = (
            <h3 className="panel-title">{this.props.maintitle}</h3>
            );



        return (

            <div className="panel panel-default">
                <div className="panel-heading">
                    {title}
                </div>
                <div class="panel-body">
                    <form  onSubmit={this.handleSubmit}>
                        <div class="btn-group">

                                <input id="message" placeholder="message" type="text" ref="message" />

                       </div>

                                <div class="btn-group">
                    <button type="submit" value="post" class="btn btn-lg btn-primary">{this.props.buttonname}</button>
                                    </div>
                    </form>
                </div>
            </div>
            );
    }


});
