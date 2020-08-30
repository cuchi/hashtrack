use super::super::context::Context;
use serde::{Deserialize, Serialize};
use std::net::TcpStream;
use websocket::client::sync::Client;
use websocket::ClientBuilder;
use websocket::OwnedMessage;

#[derive(Serialize, Deserialize, Debug)]
pub struct WsMessage<T> {
    #[serde(rename = "type")]
    msg_type: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    id: Option<i64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub payload: Option<T>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SubscriptionInitPayload {
    #[serde(rename = "Authorization")]
    authorization: String,
}

pub fn get_ws_endpoint(http_endpoint: String) -> String {
    http_endpoint
        .replace("https://", "ws://")
        .replace("http://", "ws://")
}

pub fn get_connection_init_message(context: &Context) -> Vec<u8> {
    let message = WsMessage {
        id: None,
        msg_type: String::from("connection_init"),
        payload: Some(SubscriptionInitPayload {
            authorization: context.token().unwrap_or("").into(),
        }),
    };
    serde_json::to_vec(&message).unwrap()
}

pub fn is_ack_message(message: WsMessage<String>) -> bool {
    let ack = String::from("connection_ack");
    match message {
        WsMessage { msg_type, .. } if msg_type == ack => true,
        _ => false,
    }
}

pub fn build_start_message<T: Serialize>(t: T) -> OwnedMessage {
    let message = WsMessage {
        id: Some(1),
        msg_type: String::from("start"),
        payload: Some(t),
    };
    OwnedMessage::from(serde_json::to_string(&message).unwrap())
}

pub fn build_client(endpoint: String) -> Client<TcpStream> {
    let ws_endpoint = if endpoint.starts_with("ws://") {
        endpoint
    } else {
        get_ws_endpoint(endpoint)
    };
    ClientBuilder::new(&ws_endpoint)
        .unwrap()
        .add_protocol("graphql-ws")
        .connect_insecure()
        .unwrap()
}
