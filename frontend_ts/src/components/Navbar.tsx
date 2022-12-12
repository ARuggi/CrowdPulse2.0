import React from 'react';

class Navbar extends React.Component<{}, {}> {

    render() {
        return(
            <nav className="navbar navbar-dark bg-dark">
                <div className="container-fluid">
                    <span className="navbar-brand mb-0 h1">CrowdPulse</span>
                </div>
            </nav>
        );
    }
}

export default Navbar;