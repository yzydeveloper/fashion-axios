<template>
    <div>fashion-axios</div>
</template>
<script lang="ts" setup>
import { CustomApi } from './api/custom'

CustomApi.list()

CustomApi.add<{ name: string }>({
    name: 'test3'
})

CustomApi.delete({
    id: '1'
})
</script>
