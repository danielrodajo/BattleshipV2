package com.daniel.battleship.mapper;

import org.mapstruct.Builder;
import org.mapstruct.CollectionMappingStrategy;
import org.mapstruct.Mapper;

import com.daniel.battleship.dto.BoxDTO;
import com.daniel.battleship.entity.Box;
import com.daniel.battleship.mapper.base.BaseMapper;
import com.daniel.battleship.mapper.context.BeforeMappingMapper;

@Mapper(builder = @Builder(disableBuilder = true), componentModel = "spring", collectionMappingStrategy = CollectionMappingStrategy.ADDER_PREFERRED)
public abstract class BoxMapper extends BeforeMappingMapper implements BaseMapper<Box, BoxDTO> {

}
