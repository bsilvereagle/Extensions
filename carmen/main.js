D2L.PT.Auth.SessionTimeout = {
    m_init: false,
    m_sessionLength: 180 * 6E4,
    m_expiry: "",
    m_expired: "",
    m_timeoutIsHandled: false,
    m_location: null,
    Init: function (timeout, expiry, expired, rpcLocation) {
        var me = D2L.PT.Auth.SessionTimeout;
        me.m_init = true;
        me.m_sessionLength = timeout * 6E4;
        me.m_expiry = expiry;
        me.m_expired = expired;
        me.m_location = rpcLocation;
        var sessionManager = null;
        var FindSessionManager = function (win) {
            try {
                if (win && win["D2L"] !== undefined) {
                    if (win["D2L"]["PT"]["Auth"]["SessionTimeout"]["m_init"]) sessionManager = win["D2L"]["PT"]["Auth"]["SessionTimeout"];
                    if (win.parent && win.parent != win) FindSessionManager(win.parent)
                }
            } catch (e) {}
        };
        FindSessionManager(window);
        if (sessionManager !== null) sessionManager.Reset()
    },
    Reset: function () {
        var me = D2L.PT.Auth.SessionTimeout;
        var beforeTime = 5 * 60 * 1E3;
        if (me.m_sessionLength <= beforeTime)
            if (me.m_sessionLength > 6E4) beforeTime = 6E4;
            else beforeTime = 0;
        var now = new Date;
        me.m_timeoutTime = now.getTime() + me.m_sessionLength;
        me.m_timeoutIsHandled = false;
        setTimeout(function () {
            var now2 = new Date;
            if (!me.m_timeoutIsHandled && now2.getTime() + 1E3 >=
                me.m_timeoutTime - beforeTime) {
                me.m_timeoutIsHandled = true;
                //alert(me.m_expiry);
                me.Renew()
            }
        }, me.m_sessionLength - beforeTime)
    }
};
D2L.PT.Auth.SessionTimeout.Renew = function () {
    var me = D2L.PT.Auth.SessionTimeout;
    D2L.LP.Web.UI.Rpc.Connect(D2L.LP.Web.UI.Rpc.Verbs.GET, me.m_location, undefined, {
        success: function (result) {
            if (result) me.Reset();
            else {
                D2L.LP.Web.Authentication.Xsrf.SetTokenIsStale();
                //alert(me.m_expired)
            }
        }
    })
};