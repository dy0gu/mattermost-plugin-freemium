package main

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/mattermost/mattermost/server/public/plugin"
)

func (p *Plugin) ServeHTTP(c *plugin.Context, w http.ResponseWriter, r *http.Request) {
	router := mux.NewRouter()

	router.Use(p.MattermostAuthorizationRequired)

	apiRouter := router.PathPrefix("/api/v1").Subrouter()
	apiRouter.HandleFunc("/config", p.handleGetConfig).Methods(http.MethodGet)

	router.ServeHTTP(w, r)
}

func (p *Plugin) MattermostAuthorizationRequired(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		userID := r.Header.Get("Mattermost-User-ID")
		if userID == "" {
			http.Error(w, "Not authorized", http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func (p *Plugin) handleGetConfig(w http.ResponseWriter, r *http.Request) {
	config := p.getConfiguration()

	response := map[string]bool{
		"hideEditionBadge":   config.HideEditionBadge,
		"hideHeaderBranding": config.HideHeaderBranding,
		"hideLoginBranding":  config.HideLoginBranding,
		"hideTrialPrompts":   config.HideTrialPrompts,
		"hideFooterCopyright": config.HideFooterCopyright,
		"hideUserPaidFeatures": config.HideUserPaidFeatures,
		"hideAdminPaidFeatures": config.HideAdminPaidFeatures,
		"enableBoardsFixes":  config.EnableBoardsFixes,
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		p.API.LogError("Failed to encode config response", "error", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
