package com.daniel.battleship.mapper;

import org.mapstruct.Builder;
import org.mapstruct.CollectionMappingStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.daniel.battleship.dto.InvitationDTO;
import com.daniel.battleship.entity.Invitation;
import com.daniel.battleship.mapper.base.BaseMapper;
import com.daniel.battleship.mapper.context.BeforeMappingMapper;

@Mapper(builder = @Builder(disableBuilder = true), componentModel = "spring", collectionMappingStrategy = CollectionMappingStrategy.ADDER_PREFERRED)
public abstract class InvitationMapper extends BeforeMappingMapper implements BaseMapper<Invitation, InvitationDTO> {

    @Mapping(source = "game.code", target = "gamecode")
    @Mapping(source = "receiver.nickname", target = "nickname")
	public abstract InvitationDTO toDTO(Invitation invitation);

    @Mapping(source = "gamecode", target = "game.code")
    @Mapping(source = "nickname", target = "receiver.nickname")
    public abstract Invitation toEntity(InvitationDTO invitationDTO);
	
}
