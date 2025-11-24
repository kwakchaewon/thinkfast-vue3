<template>
  <HeaderMenu>
    <div class="min-h-screen bg-white">
      <div class="px-6 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- 메인 컨텐츠 영역 (데스크톱: 8/12, 모바일: 전체) -->
          <div class="lg:col-span-8 space-y-6">
            <!-- 설문 기본 정보 -->
            <Card class="shadow-md border border-gray-200 bg-white">
              <CardHeader class="border-b border-gray-200 px-6 py-4">
                <CardTitle class="flex items-center text-xl font-semibold text-gray-800">
                  <FileEdit class="h-5 w-5 text-primary-400 mr-2" />
                  설문 기본 정보
                </CardTitle>
              </CardHeader>
            <CardContent class="p-6 space-y-4">
              <div class="relative">
                <Heading class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  v-model="survey.title"
                  placeholder="설문 제목"
                  required
                  class="pl-10 h-12 bg-white border-gray-300 rounded-lg focus:border-primary-400 focus:ring-primary-400 placeholder:text-gray-400"
                />
              </div>

              <div class="relative">
                <Type class="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Textarea
                  v-model="survey.description"
                  placeholder="설문 설명"
                  rows="3"
                  class="pl-10 bg-white border-gray-300 rounded-lg focus:border-primary-400 focus:ring-primary-400 resize-none placeholder:text-gray-400"
                />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-800 block">응답 종료일</label>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="relative">
                    <CalendarIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      v-model="survey.endDate"
                      type="date"
                      :min="minDate"
                      placeholder="날짜 선택"
                      class="pl-10 h-12 bg-white border-gray-300 rounded-lg focus:border-primary-400 focus:ring-primary-400 placeholder:text-gray-400"
                    />
                  </div>
                  <div class="flex items-center gap-2">
                    <Select v-model="selectedHour">
                      <SelectTrigger class="h-12 bg-white border-gray-300 rounded-lg focus:border-primary-400">
                        <SelectValue placeholder="시" />
                      </SelectTrigger>
                      <SelectContent class="bg-white">
                        <SelectItem
                          v-for="hour in hours"
                          :key="hour"
                          :value="hour"
                          class="bg-white hover:bg-gray-50"
                        >
                          {{ hour }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <span class="text-gray-500">:</span>
                    <Select v-model="selectedMinute">
                      <SelectTrigger class="h-12 bg-white border-gray-300 rounded-lg focus:border-primary-400">
                        <SelectValue placeholder="분" />
                      </SelectTrigger>
                      <SelectContent class="bg-white">
                        <SelectItem
                          v-for="minute in minutes"
                          :key="minute"
                          :value="minute"
                          class="bg-white hover:bg-gray-50"
                        >
                          {{ minute }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- 질문 목록 -->
          <Card class="shadow-md border border-gray-200 bg-white">
            <CardHeader class="border-b border-gray-200 px-6 py-4">
              <div class="flex items-center justify-between">
                <CardTitle class="flex items-center text-xl font-semibold text-gray-800">
                  <ListChecks class="h-5 w-5 text-primary-400 mr-2" />
                  질문 목록
                </CardTitle>
                <Button
                  class="bg-primary-400 hover:bg-primary-500 text-white h-10 px-4 rounded-lg shadow-sm transition-colors"
                  @click="addQuestion"
                >
                  <Plus class="h-4 w-4 mr-2" />
                  질문 추가
                </Button>
              </div>
            </CardHeader>

            <CardContent class="p-6">
              <div v-if="survey.questions.length === 0" class="text-center py-12">
                <ListPlus class="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <div class="text-lg font-medium text-gray-800 mb-2">질문을 추가해주세요</div>
                <div class="text-sm text-gray-500">
                  오른쪽 상단의 '질문 추가' 버튼을 클릭하여 새로운 질문을 추가할 수 있습니다.
                </div>
              </div>

              <Accordion v-else type="multiple" class="space-y-2">
                <AccordionItem
                  v-for="(question, index) in survey.questions"
                  :key="index"
                  :value="`item-${index}`"
                  class="border border-gray-200 rounded-lg bg-white"
                >
                  <AccordionTrigger class="px-4 py-3 hover:no-underline">
                    <div class="flex items-center gap-2">
                      <span class="text-base font-medium text-gray-800">질문 {{ index + 1 }}</span>
                      <Badge
                        :variant="question.required ? 'destructive' : 'secondary'"
                        class="text-xs"
                      >
                        {{ question.required ? '필수' : '선택' }}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent class="px-4 pb-4">
                    <div class="space-y-4">
                      <div class="relative">
                        <HelpCircle class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          v-model="question.content"
                          placeholder="질문"
                          required
                          class="pl-10 h-12 bg-white border-gray-300 rounded-lg focus:border-primary-400 focus:ring-primary-400 placeholder:text-gray-400"
                        />
                      </div>

                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="relative">
                          <List class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Select v-model="question.type">
                            <SelectTrigger class="pl-10 h-12 bg-white border-gray-300 rounded-lg focus:border-primary-400">
                              <SelectValue placeholder="질문 유형" />
                            </SelectTrigger>
                            <SelectContent class="bg-white">
                              <SelectItem
                                v-for="type in questionTypes"
                                :key="type.value"
                                :value="type.value"
                                class="bg-white hover:bg-gray-50"
                              >
                                {{ type.title }}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div class="flex items-center justify-between px-1">
                          <span class="text-sm text-gray-600">필수 질문</span>
                          <Switch
                            v-model="question.required"
                            class="data-[state=checked]:bg-primary-400"
                          />
                        </div>
                      </div>

                      <!-- 객관식 질문 옵션 -->
                      <div v-if="question.type === QuestionType.MULTIPLE_CHOICE && question.options" class="mt-4 p-4 border border-gray-200 rounded-lg bg-white">
                        <div class="text-sm font-medium text-gray-800 mb-3">선택 옵션</div>
                        <div class="space-y-2">
                          <div
                            v-for="(_option, optionIndex) in question.options"
                            :key="optionIndex"
                            class="flex items-center gap-2"
                          >
                            <Input
                              v-model="question.options[optionIndex]"
                              :placeholder="`옵션 ${optionIndex + 1}`"
                              class="flex-1 h-10 bg-white border-gray-300 rounded-lg focus:border-primary-400 focus:ring-primary-400 placeholder:text-gray-400"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              class="h-10 w-10 text-red-500 hover:text-red-600 hover:bg-red-50"
                              :disabled="question.options.length <= 2"
                              @click="removeOption(index, optionIndex)"
                            >
                              <Trash2 class="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          class="mt-3 text-primary-400 border-primary-400 hover:bg-primary-400 hover:text-white"
                          @click="addOption(index)"
                        >
                          <Plus class="h-4 w-4 mr-2" />
                          옵션 추가
                        </Button>
                        <div v-if="question.options.length < 2" class="text-xs text-red-500 mt-2">
                          객관식 질문은 최소 2개 이상의 옵션이 필요합니다
                        </div>
                      </div>

                      <div class="flex justify-end pt-2">
                        <Button
                          variant="ghost"
                          class="text-red-500 hover:text-red-600 hover:bg-red-50"
                          @click="removeQuestion(index)"
                        >
                          <Trash2 class="h-4 w-4 mr-2" />
                          질문 삭제
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <!-- 사이드바 영역 (데스크톱: 4/12, 모바일: 전체) -->
        <div class="lg:col-span-4">
          <!-- 설문 설정 -->
          <Card class="shadow-md border border-gray-200 bg-white">
            <CardHeader class="border-b border-gray-200 px-6 py-4">
              <CardTitle class="flex items-center text-xl font-semibold text-gray-800">
                <Settings class="h-5 w-5 text-primary-400 mr-2" />
                설문 설정
              </CardTitle>
            </CardHeader>
            <CardContent class="p-6">
              <div class="space-y-4">
                <div class="flex items-center justify-between py-2">
                  <div class="flex items-center gap-3">
                    <Users class="h-5 w-5 text-primary-400" />
                    <span class="text-sm font-medium text-gray-800">응답자 수</span>
                  </div>
                  <Badge variant="default" class="bg-primary-400 text-white">
                    무제한
                  </Badge>
                </div>

                <Separator />

                <div class="flex items-center justify-between py-2">
                  <div class="flex items-center gap-3">
                    <Clock class="h-5 w-5 text-primary-400" />
                    <span class="text-sm font-medium text-gray-800">응답 시간 제한</span>
                  </div>
                  <Badge variant="secondary" class="bg-gray-100 text-gray-600">
                    없음
                  </Badge>
                </div>

                <Separator />

                <div class="flex items-center justify-between py-2">
                  <div class="flex items-center gap-3">
                    <Eye class="h-5 w-5 text-primary-400" />
                    <span class="text-sm font-medium text-gray-800">결과 공개</span>
                  </div>
                  <Switch
                    v-model="survey.showResults"
                    class="data-[state=checked]:bg-primary-400"
                  />
                </div>
              </div>
            </CardContent>
            <Separator />
            <CardFooter class="px-6 py-4 flex justify-end">
              <Button
                class="bg-primary-400 hover:bg-primary-500 text-white h-12 px-6 rounded-lg shadow-sm transition-colors"
                @click="handleCreateSurvey"
              >
                <Save class="h-4 w-4 mr-2" />
                설문 저장
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
    </div>
  </HeaderMenu>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useSnackbar } from '@/composables/useSnackbar'
// import { useStore } from 'vuex' // 현재 미사용
import { surveyApi } from '@/apis/surveyApi'
import { QuestionType, CreateSurveyRequest } from '@/interfaces/surveyInterface'
import HeaderMenu from '@/components/mobile/HeaderMenu.vue'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  FileEdit,
  Heading,
  Type,
  CalendarIcon,
  ListChecks,
  Plus,
  ListPlus,
  HelpCircle,
  List,
  Trash2,
  Settings,
  Users,
  Clock,
  Eye,
  Save,
} from 'lucide-vue-next'

const router = useRouter()
// const store = useStore() // 현재 미사용
const { showSuccess, showError } = useSnackbar()

const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const questionTypes = [
  { title: '객관식', value: QuestionType.MULTIPLE_CHOICE },
  { title: '주관식', value: QuestionType.SUBJECTIVE }
]

const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'))

const selectedHour = ref('00')
const selectedMinute = ref('00')

const survey = ref<CreateSurveyRequest>({
  title: '',
  description: '',
  endDate: '',
  endTime: '00:00',
  showResults: true,
  questions: [],
})

// 시간 선택이 변경될 때마다 survey.endTime을 업데이트
watch([selectedHour, selectedMinute], ([hour, minute]) => {
  survey.value.endTime = `${hour}:${minute}`
})

const addQuestion = () => {
  survey.value.questions.push({
    content: '',
    type: QuestionType.SUBJECTIVE,
    required: false,
    options: ['', ''],
    orderIndex: survey.value.questions.length + 1
  })
}

const removeQuestion = (index: number) => {
  survey.value.questions.splice(index, 1)
  // 질문이 삭제된 후 남은 질문들의 orderIndex를 재정렬
  survey.value.questions.forEach((question, idx) => {
    question.orderIndex = idx + 1
  })
}

const addOption = (questionIndex: number) => {
  survey.value.questions[questionIndex].options?.push('')
}

const removeOption = (questionIndex: number, optionIndex: number) => {
  survey.value.questions[questionIndex].options?.splice(optionIndex, 1)
}

const handleCreateSurvey = async () => {
  try {
    // 필수 필드 검증
    if (!survey.value.title) {
      showError('설문 제목을 입력해주세요')
      return
    }

    if (!survey.value.endDate) {
      showError('응답 종료 날짜를 지정해주세요')
      return
    }

    if (!survey.value.endTime) {
      showError('응답 종료 시각을 지정해주세요')
      return
    }

    // 종료 날짜와 시각이 현재보다 이전인지 확인
    const endDateTime = new Date(survey.value.endDate)
    endDateTime.setHours(parseInt(survey.value.endTime.split(':')[0]))
    endDateTime.setMinutes(parseInt(survey.value.endTime.split(':')[1]))
    const now = new Date()
    if (endDateTime <= now) {
      showError('종료 날짜와 시각은 현재보다 이후여야 합니다')
      return
    }

    if (survey.value.questions.length === 0) {
      showError('최소 하나 이상의 질문을 추가해주세요')
      return
    }

    // 질문 내용 검증
    for (const question of survey.value.questions) {
      if (!question.content) {
        showError('모든 질문의 내용을 입력해주세요')
        return
      }

      if (question.type === QuestionType.MULTIPLE_CHOICE && 
          (!question.options || question.options.length < 2)) {
        showError('객관식 질문은 최소 2개 이상의 옵션이 필요합니다')
        return
      }
    }

    // API 호출
    await surveyApi.createSurvey(survey.value)
    showSuccess('설문이 성공적으로 생성되었습니다')
    router.push('/main')
  } catch (error) {
    showError('설문 생성 중 오류가 발생했습니다')
    console.error(error)
  }
}
</script>

<style scoped>
/* 추가 스타일이 필요한 경우 */
</style>
