package com.daniel.battleship.mapper;

import org.mapstruct.Builder;
import org.mapstruct.CollectionMappingStrategy;
import org.mapstruct.Mapper;

import com.daniel.battleship.dto.ShipDTO;
import com.daniel.battleship.entity.Ship;
import com.daniel.battleship.mapper.base.BaseMapper;
import com.daniel.battleship.mapper.context.BeforeMappingMapper;

@Mapper(builder = @Builder(disableBuilder = true), componentModel = "spring", collectionMappingStrategy = CollectionMappingStrategy.ADDER_PREFERRED)
public abstract class ShipMapper extends BeforeMappingMapper implements BaseMapper<Ship, ShipDTO> {

}
