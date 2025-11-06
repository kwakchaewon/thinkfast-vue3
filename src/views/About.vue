<template>
  <div class="min-h-screen flex items-center justify-center bg-white p-4">
    <Card class="w-full max-w-2xl shadow-md border border-gray-200">
      <CardHeader class="text-center py-8 px-6">
        <div class="flex items-center justify-center mb-4">
          <Info class="h-12 w-12 text-primary-400" />
        </div>
        <CardTitle class="text-3xl font-bold text-gray-800 mb-2">About</CardTitle>
        <p class="text-sm text-gray-500">ThinkFast에 대해 알아보세요</p>
      </CardHeader>

      <CardContent class="px-6 pb-8">
        <div class="space-y-6 text-center">
          <div class="space-y-3">
            <h2 class="text-xl font-semibold text-gray-800">프로젝트 소개</h2>
            <p class="text-base text-gray-600 leading-relaxed">
              ThinkFast는 AI 기반 실시간 설문조사 플랫폼입니다.
              <br />
              간편하고 빠르게 설문을 생성하고 관리할 수 있습니다.
            </p>
          </div>

          <Separator class="my-6" />

          <div class="space-y-3">
            <h2 class="text-xl font-semibold text-gray-800">주요 기능</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div class="p-4 rounded-lg border border-gray-200 bg-white">
                <FileEdit class="h-6 w-6 text-primary-400 mx-auto mb-2" />
                <h3 class="font-medium text-gray-800 mb-1">설문 생성</h3>
                <p class="text-sm text-gray-600">
                  다양한 질문 유형으로 설문을 쉽게 만들 수 있습니다.
                </p>
              </div>
              <div class="p-4 rounded-lg border border-gray-200 bg-white">
                <BarChart3 class="h-6 w-6 text-primary-400 mx-auto mb-2" />
                <h3 class="font-medium text-gray-800 mb-1">실시간 분석</h3>
                <p class="text-sm text-gray-600">
                  응답 결과를 실시간으로 확인하고 분석할 수 있습니다.
                </p>
              </div>
              <div class="p-4 rounded-lg border border-gray-200 bg-white">
                <Users class="h-6 w-6 text-primary-400 mx-auto mb-2" />
                <h3 class="font-medium text-gray-800 mb-1">응답자 관리</h3>
                <p class="text-sm text-gray-600">
                  응답자 수와 상태를 한눈에 확인할 수 있습니다.
                </p>
              </div>
              <div class="p-4 rounded-lg border border-gray-200 bg-white">
                <QrCode class="h-6 w-6 text-primary-400 mx-auto mb-2" />
                <h3 class="font-medium text-gray-800 mb-1">QR 코드 공유</h3>
                <p class="text-sm text-gray-600">
                  QR 코드로 설문을 쉽게 공유할 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          <Separator class="my-6" />

          <div class="space-y-3">
            <h2 class="text-xl font-semibold text-gray-800">기술 스택</h2>
            <div class="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary" class="px-3 py-1">Vue 3</Badge>
              <Badge variant="secondary" class="px-3 py-1">TypeScript</Badge>
              <Badge variant="secondary" class="px-3 py-1">Tailwind CSS</Badge>
              <Badge variant="secondary" class="px-3 py-1">shadcn-vue</Badge>
              <Badge variant="secondary" class="px-3 py-1">Vite</Badge>
            </div>
          </div>

          <div class="pt-4">
            <Button
              class="bg-primary-400 hover:bg-primary-500 text-white h-12 px-6 rounded-lg shadow-sm transition-colors"
              as-child
            >
              <router-link to="/main" class="flex items-center gap-2">
                <ArrowLeft class="h-4 w-4" />
                메인으로 돌아가기
              </router-link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Info,
  FileEdit,
  BarChart3,
  Users,
  QrCode,
  ArrowLeft,
} from 'lucide-vue-next'
</script>

<style scoped>
/* 추가 스타일이 필요한 경우 */
</style>
