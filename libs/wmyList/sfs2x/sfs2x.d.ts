declare namespace SFS2X{
    class SmartFox{
        constructor(a:any);
        mySelf:SFS2X.Entities.SFSUser;
        lastJoinedRoom:SFS2X.Entities.SFSRoom;
        userManager:SFS2X.Managers.UserManager;

        addEventListener(a:any,b:Function,c:any):void;
        removeEventListener(a:any,b:Function):void;
        connect();
        isConnected():boolean;
        getRoomList(): SFS2X.Entities.SFSRoom[];
        getRoomListFromGroup(groupId: string): SFS2X.Entities.SFSRoom[];
        getRoomById(id: number): SFS2X.Entities.SFSRoom;
        getRoomByName(name: string): SFS2X.Entities.SFSRoom;


        send(a:any);
        enableLagMonitor(a:any,b:any,c:any);
    }
    class SFSEvent{
       static HANDSHAKE: "handshake";
        static CONNECTION: "connection";
        static CONNECTION_LOST: "connectionLost";
        static LOGIN: "login";
        static LOGIN_ERROR: "loginError";
        static LOGOUT: "logout";
        static ROOM_ADD: "roomAdd";
        static ROOM_CREATION_ERROR: "roomCreationError";
        static ROOM_REMOVE: "roomRemove";
        static ROOM_JOIN: "roomJoin";
        static ROOM_JOIN_ERROR: "roomJoinError";
        static USER_ENTER_ROOM: "userEnterRoom";
        static USER_EXIT_ROOM: "userExitRoom";
        static USER_COUNT_CHANGE: "userCountChange";
        static PROXIMITY_LIST_UPDATE: "proximityListUpdate";
        static PLAYER_TO_SPECTATOR: "playerToSpectator";
        static PLAYER_TO_SPECTATOR_ERROR: "playerToSpectatorError";
        static SPECTATOR_TO_PLAYER: "spectatorToPlayer";
        static SPECTATOR_TO_PLAYER_ERROR: "spectatorToPlayerError";
        static ROOM_NAME_CHANGE: "roomNameChange";
        static ROOM_NAME_CHANGE_ERROR: "roomNameChangeError";
        static ROOM_PASSWORD_STATE_CHANGE: "roomPasswordStateChange";
        static ROOM_PASSWORD_STATE_CHANGE_ERROR: "roomPasswordStateChangeError";
        static ROOM_CAPACITY_CHANGE: "roomCapacityChange";
        static ROOM_CAPACITY_CHANGE_ERROR: "roomCapacityChangeError";
        static PUBLIC_MESSAGE: "publicMessage";
        static PRIVATE_MESSAGE: "privateMessage";
        static OBJECT_MESSAGE: "objectMessage";
        static MODERATOR_MESSAGE: "moderatorMessage";
        static ADMIN_MESSAGE: "adminMessage";
        static EXTENSION_RESPONSE: "extensionResponse";
        static ROOM_VARIABLES_UPDATE: "roomVariablesUpdate";
        static USER_VARIABLES_UPDATE: "userVariablesUpdate";
        static MMOITEM_VARIABLES_UPDATE: "mmoItemVariablesUpdate";
        static ROOM_GROUP_SUBSCRIBE: "roomGroupSubscribe";
        static ROOM_GROUP_SUBSCRIBE_ERROR: "roomGroupSubscribeError";
        static ROOM_GROUP_UNSUBSCRIBE: "roomGroupUnsubscribe";
        static ROOM_GROUP_UNSUBSCRIBE_ERROR: "roomGroupUnsubscribeError";
        static ROOM_FIND_RESULT: "roomFindResult";
        static USER_FIND_RESULT: "userFindResult";
        static INVITATION: "invitation";
        static INVITATION_REPLY: "invitationReply";
        static INVITATION_REPLY_ERROR: "invitationReplyError";
        static PING_PONG: "pingPong";
        static SOCKET_ERROR: "socketError";

        success: boolean;
    }
    
    interface RoomJoinEvent {
        room: SFS2X.Entities.SFSRoom;
    }

    
    interface UserVariablesUpdateEvent {
        user: SFS2X.Entities.SFSUser;
        changedVars: string[];
    }
}

declare namespace SFS2X.Managers{
    class RoomManager{
        constructor(sfs);
        getUserRooms(user):Array<SFS2X.Entities.SFSUser>;
    }
    class UserManager{
        constructor(sfs);
        getUserById(a):SFS2X.Entities.SFSUser;
        getUserByName(a):SFS2X.Entities.SFSUser;
        getUserCount():number;
    }
    
}

declare namespace SFS2X.Requests.MMO{
    class SetUserPositionRequest{
        constructor(a:any,b?:any);
    }
}
declare namespace SFS2X.Requests{
    class RoomSettings{
        constructor(name);
        allowOwnerOnlyInvitation;
        events;
        extension;
        groupId;
        isGame;
        maxSpectators;
        maxUsers;
        maxVariables;
        name;
        password;
        permissions;
        variables;
    }
}
declare namespace SFS2X.Requests.System{
    class LoginRequest{
        constructor(userName, password?, params?, zoneName?);
    }
    class CreateRoomRequest{
        constructor(settings:SFS2X.Requests.RoomSettings, autoJoin?, roomToLeave?);
    }
    class JoinRoomRequest{
        constructor(room:any, password?:any, roomIdToLeave?:any, asSpect?:any);
    }
    
    class LeaveRoomRequest {
        constructor(room:SFS2X.Entities.SFSRoom);
    }

    class SetUserVariablesRequest{
        constructor(a:any);
    }
    class SetRoomVariablesRequest{
        constructor(roomVariables, room);
    }
    
    class ExtensionRequest{
        constructor(extCmd:any, params?:any, room?:any);
    }
    class ObjectMessageRequest{
        constructor(obj:any, targetRoom?:any, recipients?:any);
    }
    class PublicMessageRequest{
        constructor(message:any, params?:any, room?:any);
    }
    
}

declare namespace SFS2X.Entities{
    class SFSUser{
        constructor();
        id;
	    name;
	    isItMe;
	    privilegeId;
	    properties;
	    aoiEntryPoint;
	    variables;
	    _playerIdByRoomId;
	    _userManager;
        containsVariable(s:string):boolean;
        getVariable(varName: string): SFS2X.Entities.Variables.SFSUserVariable;
        getVariables(): SFS2X.Entities.Variables.SFSUserVariable[];
        _setVariables(userVariables: SFS2X.Entities.Variables.SFSUserVariable[]): void;
        isJoinedInRoom(room);
    }
    class SFSRoom{
        id: number;
        groupId: string;
        isGame: boolean;
        maxSpectators: number;
        containsUser(u:SFSUser):boolean;
        getUserCount();
        getUserList():Array<SFSUser>;
        containsVariable(s:string);
        getVariable(s:string):SFS2X.Entities.Variables.SFSRoomVariable;
        getRoomManager():SFS2X.Managers.RoomManager;
    }
    class MMORoom extends SFSRoom{
    }
}

declare namespace SFS2X.Entities.Variables{
    class SFSUserVariable{
        constructor(a:any,b:any);
        isNull: boolean;
        isPrivate: boolean;
        name: string;
        type;
        value: any;
        constructor(name: string, value: any, type?);

        toString(): string;
    }
    
    class SFSRoomVariable extends SFS2X.Entities.Variables.SFSUserVariable {

        isPersistent: boolean;
        isPrivate: boolean;

        value: any;


        static fromSFSArray(data): SFSUserVariable;
    }
}
declare namespace SFS2X.Entities.Data{
    class Vec3D {
      constructor(a:any,b:any,c:any);
    }
}


