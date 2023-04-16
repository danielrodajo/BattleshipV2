package com.daniel.battleship.mapper;

import org.mapstruct.Builder;
import org.mapstruct.CollectionMappingStrategy;
import org.mapstruct.Mapper;

import com.daniel.battleship.dto.GameDTO;
import com.daniel.battleship.entity.Game;
import com.daniel.battleship.mapper.base.BaseMapper;
import com.daniel.battleship.mapper.context.BeforeMappingMapper;

@Mapper(builder = @Builder(disableBuilder = true), componentModel = "spring", collectionMappingStrategy = CollectionMappingStrategy.ADDER_PREFERRED)
public abstract class GameMapper extends BeforeMappingMapper implements BaseMapper<Game, GameDTO> {

}
