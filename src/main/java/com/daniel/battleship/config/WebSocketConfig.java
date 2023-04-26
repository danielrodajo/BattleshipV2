package com.daniel.battleship.config;

import java.security.Principal;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import com.daniel.battleship.security.service.AuthenticationService;
import com.daniel.battleship.util.Constants;

import io.jsonwebtoken.ExpiredJwtException;
import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

	private final AuthenticationService authenticationService;

	@Override
	public void configureMessageBroker(MessageBrokerRegistry config) {
		config.enableSimpleBroker(Constants.WS_TURN_RESPONSE, Constants.WS_TURN_MISSED_RESPONSE, Constants.WS_OPPONENT_ALIVE_RESPONSE,
				Constants.WS_HITTED_RESPONSE, Constants.WS_MISSED_RESPONSE, Constants.WS_ERROR_RESPONSE, Constants.WS_FINISH_GAME_RESPONSE);
		config.setApplicationDestinationPrefixes("/app");
		config.setUserDestinationPrefix("/user");
	}

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		registry.addEndpoint(Constants.SECURED_GAME_ROOM, Constants.SECURED_GAME_OPPONENT_ALIVE).setAllowedOrigins("http://localhost:3000").withSockJS()
				.setWebSocketEnabled(false).setSessionCookieNeeded(false);
	}

	@Override
	public void configureClientInboundChannel(ChannelRegistration registration) {
		registration.interceptors(new ChannelInterceptor() {

			@Override
			public Message<?> preSend(Message<?> message, MessageChannel channel) {
				StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

				if (StompCommand.CONNECT.equals(accessor.getCommand())) {
					String authToken = accessor.getFirstNativeHeader("x-auth-token");
					try {
					Principal principal = authenticationService.authenticateThroughJwt(authToken);
					accessor.setUser(principal);
					} catch (ExpiredJwtException e) {
						throw new IllegalArgumentException("Token expired");
					}
				}
				return message;
			}
		});
	}

}
