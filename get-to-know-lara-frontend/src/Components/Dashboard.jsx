import Inbox from "../Pages/UserPages/Inbox.jsx";
import Compose from "../Pages/UserPages/Compose.jsx";
import Drafts from "../Pages/UserPages/Drafts.jsx";
import Sent from "../Pages/UserPages/Sent.jsx";
import Bin from "../Pages/UserPages/Bin.jsx";

const Dashboard = () => {
    return (
        <div className="d-flex align-items-start">
            <div className="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                <button className="nav-link active" id="v-pills-inbox-tab" data-bs-toggle="pill"
                        data-bs-target="#v-pills-inbox" type="button" role="tab" aria-controls="v-pills-inbox"
                        aria-selected="true">Inbox
                </button>
                <button className="nav-link" id="v-pills-compose-tab" data-bs-toggle="pill"
                        data-bs-target="#v-pills-compose" type="button" role="tab" aria-controls="v-pills-compose"
                        aria-selected="false">Compose
                </button>
                <button className="nav-link" id="v-pills-drafts-tab" data-bs-toggle="pill"
                        data-bs-target="#v-pills-drafts" type="button" role="tab" aria-controls="v-pills-drafts"
                        aria-selected="false">Drafts
                </button>
                <button className="nav-link" id="v-pills-sent-tab" data-bs-toggle="pill"
                        data-bs-target="#v-pills-sent" type="button" role="tab" aria-controls="v-pills-sent"
                        aria-selected="false">Sent
                </button>
                <button className="nav-link" id="v-pills-bin-tab" data-bs-toggle="pill"
                        data-bs-target="#v-pills-bin" type="button" role="tab" aria-controls="v-pills-bin"
                        aria-selected="false">Bin
                </button>
            </div>
            <div className="tab-content" id="v-pills-tabContent">
                <div className="tab-pane fade show active" id="v-pills-inbox" role="tabpanel"
                     aria-labelledby="v-pills-inbox-tab" tabIndex="0"><Inbox/>
                </div>
                <div className="tab-pane fade" id="v-pills-compose" role="tabpanel"
                     aria-labelledby="v-pills-compose-tab" tabIndex="0"><Compose/>
                </div>
                <div className="tab-pane fade" id="v-pills-drafts" role="tabpanel"
                     aria-labelledby="v-pills-drafts-tab" tabIndex="0"><Drafts/>
                </div>
                <div className="tab-pane fade" id="v-pills-sent" role="tabpanel"
                     aria-labelledby="v-pills-sent-tab" tabIndex="0"><Sent/>
                </div>
                <div className="tab-pane fade" id="v-pills-bin" role="tabpanel"
                     aria-labelledby="v-pills-bin-tab" tabIndex="0"><Bin/>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;