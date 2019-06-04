#****ENDPOINT: NEW PROFILE CREATION***
  #-accepts: profile info
  #-returns: profile info
  @endpoints.method(ProfileCreateForm, EmptyResponse, 
  path='profiles', http_method='POST', name='createProfile')
  def createProfile(self, request):
    user = self._authenticateUser()
    return self._uploadNewProfile(request,user)
  #****ENDPOINT: GET PROFILE***
  #-accepts: email to which profile is associated with
  #-returns: all profile core info
  @endpoints.method(PROF_GET_REQUEST, ProfileGetResponse, 
  path='profiles/{email_to_get}', http_method='GET', name='getProfile')
  def getProfile(self, request):
    user = self._authenticateUser()
    return self._viewProfile(request, user)
  #****ENDPOINT: GET PROFILE EVENTS***
  #-accepts: email to which profile is associated with
  #-returns: all registered events, attended events, and created events for profile
  @endpoints.method(PROF_GET_REQUEST, GetProfileEvents, 
  path='profiles/{email_to_get}/events', http_method='GET', name='getProfileEvents')
  def getProfileEvents(self, request):
    user = self._authenticateUser()
    return self._viewProfileEvents(request, user)
  #****ENDPOINT: GET PROFILE TEAMS***
  #-accepts: email to which profile is associated with
  #-returns: all registered teams
  @endpoints.method(PROF_GET_REQUEST, GetProfileTeamsResponse, 
  path='profiles/{email_to_get}/teams', http_method='GET', name='getProfileTeams')
  def getProfileTeams(self, request):
    user = self._authenticateUser()
    return self._viewProfileTeams(request, user)
  #****ENDPOINT: GET PROFILE UPDATES***
  #-accepts: email to which profile is associated with
  #-returns: all updates in the past week for the teams/events user is a part of
  @endpoints.method(EMPTY_REQUEST, EventUpdatesGetResponse, 
  path='profiles/updates', http_method='GET', name='getProfileUpdates')
  def getProfileUpdates(self, request):
    user = self._authenticateUser()
    return self._viewProfileUpdates(request, user)
  #****ENDPOINT: EDIT PROFILE***
  #-accepts: LoginForm (email, password)
  #-returns: user email
  @endpoints.method(ProfileEditForm, EmptyResponse, 
  path='profiles', http_method='PUT', name='editProfile')
  def editProfile(self, request):
    user = self._authenticateUser()
    return self._editExistingProfile(request, user)
  #****ENDPOINT: DELETE PROFILE***
  #-accepts: user email (which is the Profile entity key name)
  #-returns: user email of deleted profile
  @endpoints.method(EMPTY_REQUEST, EmptyResponse, 
  path='profiles', http_method='DELETE', name='deleteProfile')
  def deleteProfile(self, request):
    user = self._authenticateUser()
    return self._removeProfile(request, user)
  #****ENDPOINT: CREATE EVENT***
  #-accepts: user email (which is the Profile entity key name)
  #-returns: user email of deleted profile
  @endpoints.method(EventCreateForm, EmptyResponse, 
  path='events', http_method='POST', name='createEvent')
  def createEvent(self, request):
    user = self._authenticateUser()
    return self._createEvent(request, user)
  #****ENDPOINT: GET EVENT***
  #-accepts: event organizer email, original event name (url-safe)
  #-returns: all event core info
  @endpoints.method(EVENT_DEL_REQUEST, EventGetResponse, 
  path='events/{e_organizer_email}/{url_event_orig_name}', http_method='GET', name='getEvent')
  def getEvent(self, request):
    user = self._authenticateUser()
    return self._viewEvent(request, user)
  '''
  #****ENDPOINT: GET EVENT ROSTER***
  #-accepts: event organizer email, original event name (url-safe)
  #-returns: event roster info
  @endpoints.method(EVENT_DEL_REQUEST, EventRosterGetResponse, 
  path='events/{e_organizer_email}/{url_event_orig_name}/roster', http_method='GET', name='getEventRoster')
  def getEventRoster(self, request):
    self._authenticateUser()
    return self._viewEventRoster(request)
  '''
  #****ENDPOINT: GET EVENT UPDATES***
  #-accepts: event organizer email, original event name (url-safe)
  #-returns: event updates and update date/times
  @endpoints.method(EVENT_DEL_REQUEST, EventUpdatesGetResponse, 
  path='events/{e_organizer_email}/{url_event_orig_name}/updates', http_method='GET', name='getEventUpdates')
  def getEventUpdates(self, request):
    self._authenticateUser()
    return self._viewEventUpdates(request)
  #****ENDPOINT: GET EVENTS IN RADIUS***
  #-accepts: email and password
  #-returns: list of 20 closest events
  @endpoints.method(PROF_DEL_REQUEST, GetEventsInRadiusResponse, 
  path='events/prefill', http_method='GET', name='getEventsInRadius')
  def getEventsInRadius(self, request):
    user = self._authenticateUser()
    return self._getRadiusEvents(request,user)
  #****ENDPOINT: GET EVENTS IN RADIUS SORTED BY DATE***
  #-accepts: email and password
  #-returns: list of 50 closest events
  @endpoints.method(PROF_DEL_REQUEST, GetEventsInRadiusByDateResponse, 
  path='events/prefill/dates', http_method='GET', name='getEventsInRadiusByDate')
  def getEventsInRadiusByDate(self, request):
    user = self._authenticateUser()
    return self._getRadiusEventsByDate(request,user)
  
  #****ENDPOINT: EDIT EVENT***
  #-accepts: user email (which is the Profile entity key name)
  #-returns: user email of deleted profile
  @endpoints.method(EventEditForm, EmptyResponse,
  path='events', http_method='PUT', name='editEvent')
  def editEvent(self, request):
    user = self._authenticateUser()
    return self._editExistingEvent(request, user)
    
  #****ENDPOINT: DELETE EVENT***
  #-accepts: original event name, event creator email
  #-returns: name of deleted event
  @endpoints.method(EVENT_DEL_REQUEST, EmptyResponse, 
  path='events/{url_event_orig_name}', http_method='DELETE', name='deleteEvent')
  def deleteEvent(self, request):
    user = self._authenticateUser()
    return self._removeEvent(request, user)
  #****ENDPOINT: ADD EVENT LEADERS***
  #-accepts: leaders to add, original event name, user email, user password
  #-returns: leaders to add, original event name, user email, user password
  @endpoints.method(EVENT_ADD_LEADERS_REQUEST, EmptyResponse,
  path='events/{url_event_orig_name}/leaders', http_method='PUT', name='addEventLeaders')
  def addEventLeaders(self, request):
    user = self._authenticateUser()
    return self._addLeaders(request, user)
  #****ENDPOINT: DELETE EVENT LEADERS***
  #-accepts: leaders to delete, original event name, user email, user password
  #-returns: leaders to delete, original event name, user email, user password
  @endpoints.method(EVENT_DELETE_LEADERS_REQUEST, EmptyResponse,
  path='events/{url_event_orig_name}/leaders', http_method='DELETE', name='deleteEventLeaders')
  def deleteEventLeaders(self, request):
    user = self._authenticateUser()
    return self._deleteLeaders(request, user)
  #****ENDPOINT: ADD TEAM LEADERS***
  #-accepts: leaders to add, original team name
  #-returns: none
  @endpoints.method(TEAM_ADD_LEADERS_REQUEST, EmptyResponse,
  path='teams/{team_orig_name}/leaders', http_method='PUT', name='addTeamLeaders')
  def addTeamLeaders(self, request):
    user = self._authenticateUser()
    return self._addTeamLeaders(request, user)
  #****ENDPOINT: DELETE TEAM LEADERS***
  #-accepts: leaders to delete, original event name, user email, user password
  #-returns: leaders to delete, original event name, user email, user password
  @endpoints.method(TEAM_DELETE_LEADERS_REQUEST, EmptyResponse,
  path='teams/{team_orig_name}/leaders', http_method='DELETE', name='deleteTeamLeaders')
  def deleteTeamLeaders(self, request):
    user = self._authenticateUser()
    return self._deleteTeamLeaders(request, user)
  #****ENDPOINT: CREATE NEW TEAM***
  #-accepts: TeamCreateForm (team info)
  #-returns: team info
  @endpoints.method(TeamCreateForm, EmptyResponse, 
  path='teams', http_method='POST', name='createTeam')
  def createTeam(self, request):
    user = self._authenticateUser()
    return self._uploadNewTeam(request, user)
  #****ENDPOINT: EDIT TEAM***
  #-accepts: original team name, team info to change
  #-returns: original team name, team info to change
  @endpoints.method(TeamEditForm, EmptyResponse,
  path='teams', http_method='PUT', name='editTeam')
  def editTeam(self, request):
    user = self._authenticateUser()
    return self._editExistingTeam(request, user)
  #****ENDPOINT: DELETE TEAM***
  #-accepts: original team name
  #-returns: name of deleted team
  @endpoints.method(TEAM_DEL_REQUEST, EmptyResponse, 
  path='teams/{url_team_orig_name}', http_method='DELETE', name='deleteTeam')
  def deleteTeam(self, request):
    user = self._authenticateUser()
    return self._removeTeam(request, user)
  #****ENDPOINT: GET TEAM***
  #-accepts: original team name
  #-returns: all team info
  @endpoints.method(TEAM_DEL_REQUEST, TeamGetResponse, 
  path='teams/{url_team_orig_name}', http_method='GET', name='getTeam')
  def getTeam(self, request):
    user = self._authenticateUser()
    return self._viewTeam(request,user)
  #****ENDPOINT: GET TEAM HISTORY***
  #-accepts: original team name
  #-returns: all team info
  @endpoints.method(TEAM_DEL_REQUEST, TeamHistoryGetResponse, 
  path='teams/{url_team_orig_name}/history', http_method='GET', name='getTeamHistory')
  def getTeamHistory(self, request):
    self._authenticateUser()
    return self._viewTeamHistory(request)
  '''
  #****ENDPOINT: GET TEAM ROSTER***
  #-accepts: original team name (url-safe)
  #-returns: team roster info
  @endpoints.method(TEAM_DEL_REQUEST, TeamRosterGetResponse, 
  path='teams/{url_team_orig_name}/roster', http_method='GET', name='getTeamRoster')
  def getTeamRoster(self, request):
    self._authenticateUser()
    return self._viewTeamRoster(request)
  '''
  #****ENDPOINT: GET SUGGESTED TEAMS***
  #-accepts: empty request
  #-returns: all team info
  @endpoints.method(EMPTY_REQUEST, GetProfileSuggestedTeams, 
  path='teams/suggested', http_method='GET', name='getSuggestedTeams')
  def getSuggestedTeam(self, request):
    user = self._authenticateUser()
    return self._viewSuggestedTeams(request, user)
  #****ENDPOINT: GET TOP TEAMS***
  #-accepts: empty request
  #-returns: all team info
  @endpoints.method(EMPTY_REQUEST, TopTeamsResponse, 
  path='teams/top', http_method='GET', name='getTopTeams')
  def getTopTeams(self, request):
    self._authenticateUser()
    return self._viewTopTeams(request)
  """
  #****ENDPOINT: REGISTER TEAM FOR EVENT***
  #-accepts: event name to sign up for, event organizer email
  #-returns: event signed up for
  @endpoints.method(TEAM_EVENT_REG_REQUEST, EmptyResponse,
  path='events/{e_organizer_email}/{url_event_orig_name}/registration/team', http_method='PUT', name='registerTeamForEvent')
  def registerTeamForEvent(self, request):
    user = self._authenticateUser()
    return self._signUpTeamEvent(request, user)
  
  #****ENDPOINT: DEREGISTER TEAM FROM EVENT***
  #-accepts: event name to sign out of, event organizer email
  #-returns: event signed out of
  @endpoints.method(TEAM_EVENT_DEREG_REQUEST, EmptyResponse,
  path='events/{e_organizer_email}/{url_event_orig_name}/registration/team', http_method='DELETE', name='deregisterTeamFromEvent')
  def deregisterTeamFromEvent(self, request):
    user = self._authenticateUser()
    return self._signOutTeamEvent(request, user)
  """
  #****ENDPOINT: REGISTER USER FOR EVENT***
  #-accepts: event name to sign up for, event organizer email
  #-returns: event signed up for
  @endpoints.method(REGISTER_EVENT_REQUEST, EmptyResponse,
  path='events/{e_organizer_email}/{url_event_orig_name}/registration', http_method='PUT', name='registerForEvent')
  def RegisterForEvent(self, request):
    user = self._authenticateUser()
    return self._signUpEvent(request, user)
  
  #****ENDPOINT: DEREGISTER USER FOR EVENT***
  #-accepts: event name to sign up for, event organizer email
  #-returns: event signed up for
  @endpoints.method(EVENT_DEL_REQUEST, EmptyResponse,
  path='events/{e_organizer_email}/{url_event_orig_name}/registration', http_method='DELETE', name='deregisterForEvent')
  def deregisterForEvent(self, request):
    user = self._authenticateUser()
    return self._signOutEvent(request, user)
  #****ENDPOINT: REGISTER USER FOR TEAM***
  #-accepts: original team name to sign up for (team name is unique)
  #-returns: team name signed up for
  @endpoints.method(TEAM_DEL_REQUEST, EmptyResponse,
  path='teams/{url_team_orig_name}/registration', http_method='GET', name='registerForTeam')
  def RegisterForTeam(self, request):
    user = self._authenticateUser()
    return self._signUpTeam(request,user)
  #****ENDPOINT: DEREGISTER USER FOR TEAM***
  #-accepts: team name to signup for
  #-returns: team signed up for
  @endpoints.method(TEAM_DEL_REQUEST, EmptyResponse,
  path='teams/{url_team_orig_name}/registration', http_method='DELETE', name='deregisterForTeam')
  def deregisterForTeam(self, request):
    user = self._authenticateUser()
    return self._signOutTeam(request, user)
  #****ENDPOINT: QR EVENT IN OR OUT***
  #-accepts: event name to qr sign up for, event organizer email
  #-returns: event qr signed in to
  @endpoints.method(QR_SIGNIN_REQUEST, GenericOneLiner,
  path='events/{e_organizer_email}/{url_event_orig_name}/qr', http_method='GET', name='qrEvent')
  def qrEvent(self, request):
    user = self._authenticateUser()
    return self._qrEvent(request, user)
  '''
  #****ENDPOINT: QR EVENT USER SIGN OUT***
  #-accepts: event name to qr sign out of for, event organizer email
  #-returns: event qr signed in to
  @endpoints.method(EVENT_DEL_REQUEST, EmptyResponse,
  path='events/{e_organizer_email}/{url_event_orig_name}/qr', http_method='DELETE', name='qrSignOutEvent')
  def qrSignOutEvent(self, request):
    user = self._authenticateUser()
    return self._qrOutEvent(request, user)
  '''
  #****ENDPOINT: EVENT SEARCH***
  #-accepts: keyword/event name to search events for
  #-returns: list of names and list of event ids
  @endpoints.method(SEARCH_REQUEST, EventSearchResponse,
  path='events/search', http_method='GET', name='searchEvent')
  def searchEvent(self, request):
    user = self._authenticateUser()
    return self._mainSearchEvent(request, user)
  #****ENDPOINT: PROFILE SEARCH***
  #-accepts: first and/or last name to search profile for
  #-returns: list of profile names, pics, and emails
  @endpoints.method(SEARCH_REQUEST, ProfileSearchResponse,
  path='profiles/search', http_method='GET', name='searchProfile')
  def searchProfile(self, request):
    self._authenticateUser()
    return self._searchProfile(request)
  #****ENDPOINT: TEAM SEARCH***
  #-accepts: search terms for team
  #-returns: list of team pics, names, distances, and ids
  @endpoints.method(SEARCH_REQUEST, TeamSearchResponse,
  path='teams/search', http_method='GET', name='searchTeam')
  def searchTeam(self, request):
    user = self._authenticateUser()
    return self._searchTeam(request, user)
  
  #****ENDPOINT: APPROVE PENDING EVENT ATTENDEES***
  #-accepts: event name, event organizer email
  #-returns: none
  @endpoints.method(EVENT_APPROVE_REQUEST, EmptyResponse,
  path='events/{e_organizer_email}/{url_event_orig_name}/approve', http_method='PUT', name='eventApprovePending')
  def eventApprovePending(self, request):
    user = self._authenticateUser()
    return self._eApprovePending(request, user)
  #****ENDPOINT: DENY PENDING EVENT ATTENDEES***
  #-accepts: event name, event organizer email
  #-returns: none
  @endpoints.method(EVENT_APPROVE_REQUEST, EmptyResponse,
  path='events/{e_organizer_email}/{url_event_orig_name}/deny', http_method='PUT', name='eventDenyPending')
  def eventDenyPending(self, request):
    user = self._authenticateUser()
    return self._eDenyPending(request, user)
  #****ENDPOINT: APPROVE PENDING TEAM MEMBERS***
  #-accepts: list of approvals (emails), team name
  #-returns: list of approvals
  @endpoints.method(APPROVE_TEAM_MEMBERS_REQUEST, EmptyResponse,
  path='teams/{team_name}/approve', http_method='PUT', name='teamApprovePending')
  def teamApprovePending(self, request):
    user = self._authenticateUser()
    return self._tApprovePending(request, user)
  #****ENDPOINT: DENY PENDING TEAM MEMBERS***
  #-accepts: list of denials (emails), team name
  #-returns: list of denials
  @endpoints.method(APPROVE_TEAM_MEMBERS_REQUEST, EmptyResponse,
  path='teams/{team_name}/deny', http_method='PUT', name='teamDenyPending')
  def teamDenyPending(self, request):
    user = self._authenticateUser()
    return self._tDenyPending(request, user)
  
  """
  #****ENDPOINT: APPROVE PENDING TEAMS FOR EVENT***
  #-accepts: list of approvals (team names), event organizer email, event original name
  #-returns: empty
  @endpoints.method(APPROVE_PENDING_TEAMS_REQUEST, EmptyResponse,
  path='events/{e_organizer_email}/{url_event_orig_name}/approveteam', http_method='PUT', name='eventApprovePendingTeams')
  def eventApprovePendingTeams(self, request):
    user = self._authenticateUser()
    return self._eApprovePendingTeams(request, user)
  """
  """
  #****ENDPOINT: clean events debugger***
  @endpoints.method(EMPTY_REQUEST, EmptyResponse,
  path='debug', http_method='GET', name='debug')
  def debug(self, request):
    return self._eventsCleanPast()
  #****ENDPOINT: clean events debugger***
  @endpoints.method(EMPTY_REQUEST, EmptyResponse,
  path='debug2', http_method='GET', name='debug2')
  def debug2(self, request):
    return self._eventsDistributeRemainingHours()
  
  #****ENDPOINT: update top teams debugger***
  @endpoints.method(EMPTY_REQUEST, EmptyResponse,
  path='debug3', http_method='GET', name='debug3')
  def debug3(self, request):
    return self._updateTopTeams()
  #****ENDPOINT: create Top_Teams entity***
  @endpoints.method(EMPTY_REQUEST, EmptyResponse,
  path='topteams', http_method='GET', name='topteams')
  def topteams(self, request):
    return self._createTopTeams()
  """