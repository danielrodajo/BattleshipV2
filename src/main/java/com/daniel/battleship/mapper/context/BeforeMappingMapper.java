package com.daniel.battleship.mapper.context;

import java.util.IdentityHashMap;
import java.util.Map;

import org.mapstruct.BeforeMapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.TargetType;

public class BeforeMappingMapper {

	private final Map<Object, Object> knownInstances = new IdentityHashMap<>();
	
	@BeforeMapping
	public <T> T getMappedInstace(Object source, @TargetType Class<T> targetType) {
		return targetType.cast(knownInstances.get(source));
	}
	
	public void storeMappedInstance(Object source, @MappingTarget Object target) {
		knownInstances.put(source, target);
	}
	
}
